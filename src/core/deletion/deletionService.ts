import { App, EventRef, Notice, TFile } from 'obsidian';
import type { SidecarCreatorSettings } from '../../settings';
import { shouldCreateSidecarForFile } from '../fileClassifier';
import { IfOriginalDeletedService } from './ifOriginalDeleted/ifOriginalDeletedService';
import { IfSidecarDeletedService } from './ifSidecarDeleted/ifSidecarDeletedService';

const SIDECAR_TAG = 'sidecar';
const SIDECAR_LINK_FIELD = 'sidecar_linkToOriginal';

type OriginalLinkResult =
	| { ok: true; linkText: string; originalFile: TFile }
	| { ok: false; reason: string };

export class DeletionService {
	private ifSidecarDeletedService: IfSidecarDeletedService;
	private ifOriginalDeletedService: IfOriginalDeletedService;

	constructor(private app: App, private getSettings: () => SidecarCreatorSettings) {
		this.ifSidecarDeletedService = new IfSidecarDeletedService(app, getSettings);
		this.ifOriginalDeletedService = new IfOriginalDeletedService(app, getSettings);
	}

	registerEvents(registerEvent: (eventRef: EventRef) => void): void {
		this.log('1', 'Подписываемся на событие удаления файлов.');
		registerEvent(
			this.app.vault.on('delete', (file) => {
				if (!(file instanceof TFile)) return;
				void this.handleDelete(file);
			})
		);
	}

	async handleDelete(file: TFile): Promise<void> {
		this.log('1', `Получено событие удаления: ${file.path}`);

		const isMarkdown = file.extension.toLowerCase() === 'md';
		this.log('2', `Определяем тип файла: ${isMarkdown ? 'md' : 'non-md'}`);

		if (isMarkdown) {
			await this.handleSidecarDeletion(file);
			return;
		}

		await this.handleOriginalDeletion(file);
	}

	private async handleSidecarDeletion(file: TFile): Promise<void> {
		const hasSidecarTag = this.hasSidecarTag(file);
		this.log('3.1', `Проверяем тег #sidecar: ${hasSidecarTag ? 'есть' : 'нет'}`);

		if (!hasSidecarTag) {
			this.log('3.1.1', 'Тега нет, ничего не делаем.');
			return;
		}

		const originalLinkResult = this.resolveOriginalFromSidecar(file);
		if (!originalLinkResult.ok) {
			this.log('3.1.2.1', originalLinkResult.reason);
			this.showError(`Ошибка в sidecar: ${originalLinkResult.reason}`);
			return;
		}

		this.log(
			'3.1.2.2',
			`Все корректно, пробрасываем в ifSidecarDeletedService: ${originalLinkResult.originalFile.path}`
		);
		await this.ifSidecarDeletedService.handleSidecarDeleted(file, originalLinkResult.originalFile);
	}

	private async handleOriginalDeletion(file: TFile): Promise<void> {
		const settings = this.getSettings();
		const matchesImportFilter = shouldCreateSidecarForFile(file, settings);
		this.log(
			'3.2',
			`Проверяем режим фильтрации obsidian import: ${matchesImportFilter ? 'подходит' : 'не подходит'}`
		);

		if (!matchesImportFilter) {
			this.log('3.2.1', 'Файл не подходит под фильтр, ничего не делаем.');
			return;
		}

		const sidecarCandidates = this.findSidecarCandidatesForOriginal(file);
		this.log(
			'3.2.2',
			`Найдено sidecar-кандидатов после фильтрации: ${sidecarCandidates.length}`
		);

		if (sidecarCandidates.length !== 1) {
			const reason = `Ожидался ровно 1 sidecar, найдено: ${sidecarCandidates.length}`;
			this.log('3.2.2.2', reason);
			this.showError(`Ошибка при поиске sidecar для ${file.path}. ${reason}`);
			return;
		}

		const sidecarCandidate = sidecarCandidates[0];
		if (!sidecarCandidate) {
			const reason = 'Не удалось получить sidecar из списка кандидатов.';
			this.log('3.2.2.2', reason);
			this.showError(`Ошибка при поиске sidecar для ${file.path}. ${reason}`);
			return;
		}

		this.log(
			'3.2.2.3',
			`Все корректно, пробрасываем в ifOriginalDeletedService: ${sidecarCandidate.path}`
		);
		await this.ifOriginalDeletedService.handleOriginalDeleted(file, sidecarCandidate);
	}

	private hasSidecarTag(file: TFile): boolean {
		const cache = this.app.metadataCache.getFileCache(file);
		const tags = cache?.frontmatter?.tags;
		if (!tags) return false;
		if (Array.isArray(tags)) return tags.includes(SIDECAR_TAG);
		return tags === SIDECAR_TAG;
	}

	private resolveOriginalFromSidecar(sidecarFile: TFile): OriginalLinkResult {
		const cache = this.app.metadataCache.getFileCache(sidecarFile);
		const frontmatter = cache?.frontmatter;
		if (!frontmatter) {
			return { ok: false, reason: 'Frontmatter не найден.' };
		}

		if (!(SIDECAR_LINK_FIELD in frontmatter)) {
			return { ok: false, reason: `Свойство "${SIDECAR_LINK_FIELD}" отсутствует.` };
		}

		const linkText = this.extractLinkText(frontmatter[SIDECAR_LINK_FIELD]);
		if (!linkText) {
			return { ok: false, reason: `Свойство "${SIDECAR_LINK_FIELD}" не содержит корректную ссылку.` };
		}

		const resolved = this.app.metadataCache.getFirstLinkpathDest(linkText, sidecarFile.path);
		if (!resolved) {
			return { ok: false, reason: `Файл по ссылке "${linkText}" не найден.` };
		}

		if (resolved.extension.toLowerCase() === 'md') {
			return { ok: false, reason: `Ссылка ведет на markdown файл "${resolved.path}".` };
		}

		return { ok: true, linkText, originalFile: resolved };
	}

	private findSidecarCandidatesForOriginal(originalFile: TFile): TFile[] {
		const resolvedLinks = this.app.metadataCache.resolvedLinks;
		const candidatePaths = Object.entries(resolvedLinks)
			.filter(([, destinations]) => Object.keys(destinations).includes(originalFile.path))
			.map(([sourcePath]) => sourcePath);

		const candidates = candidatePaths
			.map((path) => this.app.vault.getAbstractFileByPath(path))
			.filter((file): file is TFile => file instanceof TFile);

		return candidates.filter((candidate) => this.isValidSidecarCandidate(candidate, originalFile));
	}

	private isValidSidecarCandidate(candidate: TFile, originalFile: TFile): boolean {
		if (!this.hasSidecarTag(candidate)) {
			this.log('3.2.2.1', `Файл ${candidate.path} без тега #sidecar, пропускаем.`);
			return false;
		}

		const cache = this.app.metadataCache.getFileCache(candidate);
		const linkText = this.extractLinkText(cache?.frontmatter?.[SIDECAR_LINK_FIELD]);
		if (!linkText) {
			this.log(
				'3.2.2.1',
				`Файл ${candidate.path} без свойства "${SIDECAR_LINK_FIELD}", пропускаем.`
			);
			return false;
		}

		if (!this.linkPointsToFile(linkText, candidate.path, originalFile)) {
			this.log(
				'3.2.2.1',
				`Файл ${candidate.path} не ссылается на удаляемый оригинал, пропускаем.`
			);
			return false;
		}

		return true;
	}

	private linkPointsToFile(linkText: string, sourcePath: string, targetFile: TFile): boolean {
		const resolved = this.app.metadataCache.getFirstLinkpathDest(linkText, sourcePath);
		if (resolved?.path === targetFile.path) return true;

		const normalized = this.normalizeLinkPath(linkText);
		if (normalized === targetFile.path) return true;

		const linkTextForFile = this.app.metadataCache.fileToLinktext(targetFile, sourcePath, false);
		return normalized === linkTextForFile;
	}

	private extractLinkText(value: unknown): string | null {
		if (typeof value === 'string') {
			return this.normalizeLinkPath(value);
		}

		if (Array.isArray(value) && typeof value[0] === 'string') {
			return this.normalizeLinkPath(value[0]);
		}

		return null;
	}

	private normalizeLinkPath(raw: string): string {
		const trimmed = raw.trim();
		const match = trimmed.match(/^\[\[(.+?)\]\]$/);
		const inner = match?.[1] ?? trimmed;
		const [pathPart = ''] = inner.split('|');
		const [pathWithoutHeading = ''] = pathPart.split('#');
		return pathWithoutHeading.trim();
	}

	private showError(message: string): void {
		new Notice(`[Sidecar Creator] ${message}`);
		console.warn(`[Sidecar Creator][Deletion] ${message}`);
	}

	private log(step: string, message: string): void {
		console.log(`[Sidecar Creator][Deletion] Шаг ${step}: ${message}`);
	}
}
