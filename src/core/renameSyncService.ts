import { App, EventRef, TAbstractFile, TFile } from 'obsidian';
import type { SidecarCreatorSettings } from '../settings';
import { PathResolver } from './pathResolver';

export class RenameSyncService {
	private isRenaming = false;
	private pathResolver: PathResolver;

	constructor(private app: App, private getSettings: () => SidecarCreatorSettings) {
		this.pathResolver = new PathResolver(app, getSettings);
	}

	registerEvents(registerEvent: (eventRef: EventRef) => void): void {
		registerEvent(
			this.app.vault.on('rename', (file, oldPath) => {
				void this.handleRename(file, oldPath);
			})
		);
	}

	async handleRename(file: TAbstractFile, oldPath: string) {
		if (this.isRenaming) return;
		if (!(file instanceof TFile)) return;

		// 1. Check if we renamed a Sidecar file
		const isSidecar = this.isSidecarFile(file);
		if (isSidecar) {
			await this.syncOriginalToMatchSidecar(file);
			return;
		}

		// 2. Check if we renamed an Original file
		if (file.extension !== 'md') {
			await this.syncSidecarToMatchOriginal(file, oldPath);
		}
	}

	// A: Original renamed -> Rename Sidecar
	private async syncSidecarToMatchOriginal(original: TFile, oldOriginalPath: string) {
		const sidecarCandidates = this.findSidecarCandidatesForOriginal(original, oldOriginalPath);
		if (sidecarCandidates.length !== 1) {
			console.warn(
				`[Sidecar Creator][Rename] Expected 1 sidecar for ${original.path}, found ${sidecarCandidates.length}.`
			);
			return;
		}

		const sidecar = sidecarCandidates[0];
		if (!sidecar) {
			console.warn(`[Sidecar Creator][Rename] Sidecar candidate missing for ${original.path}.`);
			return;
		}

		const newSidecarPath = this.pathResolver.resolvePath(original);
		if (sidecar.path === newSidecarPath) return;

		this.isRenaming = true;
		try {
			await this.app.fileManager.renameFile(sidecar, newSidecarPath);
		} finally {
			this.isRenaming = false;
		}
	}

	// B: Sidecar renamed -> Rename Original
	private async syncOriginalToMatchSidecar(sidecar: TFile) {
		// Expect sidecar name: "Image.png.md"
		if (!sidecar.name.endsWith('.md')) return;

		const originalResult = this.resolveOriginalFromSidecar(sidecar);
		if (!originalResult.ok) {
			console.warn(`[Sidecar Creator][Rename] ${originalResult.reason}`);
			return;
		}

		const original = originalResult.originalFile;
		const newOriginalName = sidecar.name.slice(0, -3);
		const parentPath = original.parent?.path ?? '';
		const newOriginalPath = parentPath ? `${parentPath}/${newOriginalName}` : newOriginalName;

		if (original.path === newOriginalPath) return;

		this.isRenaming = true;
		try {
			await this.app.fileManager.renameFile(original, newOriginalPath);
		} finally {
			this.isRenaming = false;
		}
	}

	private isSidecarFile(file: TFile): boolean {
		if (file.extension !== 'md') return false;

		const cache = this.app.metadataCache.getFileCache(file);
		if (!cache?.frontmatter) return false;

		const hasTag = this.hasSidecarTag(file);
		const hasLink = 'sidecar_linkToOriginal' in cache.frontmatter;

		return hasTag && hasLink;
	}

	private hasSidecarTag(file: TFile): boolean {
		const cache = this.app.metadataCache.getFileCache(file);
		const tags = cache?.frontmatter?.tags;
		if (!tags) return false;
		if (Array.isArray(tags)) return tags.includes('sidecar');
		return tags === 'sidecar';
	}

	private resolveOriginalFromSidecar(sidecarFile: TFile): { ok: true; originalFile: TFile } | { ok: false; reason: string } {
		const cache = this.app.metadataCache.getFileCache(sidecarFile);
		const frontmatter = cache?.frontmatter;
		if (!frontmatter) {
			return { ok: false, reason: 'Frontmatter не найден.' };
		}

		if (!('sidecar_linkToOriginal' in frontmatter)) {
			return { ok: false, reason: 'Свойство "sidecar_linkToOriginal" отсутствует.' };
		}

		const linkText = this.extractLinkText(frontmatter.sidecar_linkToOriginal);
		if (!linkText) {
			return { ok: false, reason: 'Свойство "sidecar_linkToOriginal" не содержит корректную ссылку.' };
		}

		const resolved = this.app.metadataCache.getFirstLinkpathDest(linkText, sidecarFile.path);
		if (!resolved) {
			return { ok: false, reason: `Файл по ссылке "${linkText}" не найден.` };
		}

		if (resolved.extension.toLowerCase() === 'md') {
			return { ok: false, reason: `Ссылка ведет на markdown файл "${resolved.path}".` };
		}

		return { ok: true, originalFile: resolved };
	}

	private findSidecarCandidatesForOriginal(originalFile: TFile, oldOriginalPath?: string): TFile[] {
		const resolvedLinks = this.app.metadataCache.resolvedLinks;
		const candidatePaths = Object.entries(resolvedLinks)
			.filter(([, destinations]) => {
				const destinationPaths = Object.keys(destinations);
				if (destinationPaths.includes(originalFile.path)) return true;
				if (oldOriginalPath && destinationPaths.includes(oldOriginalPath)) return true;
				return false;
			})
			.map(([sourcePath]) => sourcePath);

		const candidates = candidatePaths
			.map((path) => this.app.vault.getAbstractFileByPath(path))
			.filter((file): file is TFile => file instanceof TFile);

		return candidates.filter((candidate) =>
			this.isValidSidecarCandidate(candidate, originalFile, oldOriginalPath)
		);
	}

	private isValidSidecarCandidate(candidate: TFile, originalFile: TFile, oldOriginalPath?: string): boolean {
		if (!this.hasSidecarTag(candidate)) {
			return false;
		}

		const cache = this.app.metadataCache.getFileCache(candidate);
		const linkText = this.extractLinkText(cache?.frontmatter?.sidecar_linkToOriginal);
		if (!linkText) {
			return false;
		}

		if (this.linkPointsToFile(linkText, candidate.path, originalFile)) return true;
		if (oldOriginalPath && this.linkPointsToPath(linkText, oldOriginalPath)) return true;

		return false;
	}

	private linkPointsToFile(linkText: string, sourcePath: string, targetFile: TFile): boolean {
		const resolved = this.app.metadataCache.getFirstLinkpathDest(linkText, sourcePath);
		if (resolved?.path === targetFile.path) return true;

		const normalized = this.normalizeLinkPath(linkText);
		if (normalized === targetFile.path) return true;

		const linkTextForFile = this.app.metadataCache.fileToLinktext(targetFile, sourcePath, false);
		return normalized === linkTextForFile;
	}

	private linkPointsToPath(linkText: string, targetPath: string): boolean {
		const normalized = this.normalizeLinkPath(linkText);
		return normalized === targetPath;
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
}
