import { normalizePath, type App, type TFile, TFolder, moment, Notice } from 'obsidian';
import type { SidecarCreatorSettings } from '../settings';
import { DEFAULT_NAMING_PATTERN } from '../settings';

export class PathResolver {
	// Принимаем функцию-геттер, чтобы всегда получать актуальные настройки
	constructor(private app: App, private getSettings: () => SidecarCreatorSettings) {}

	public resolvePath(original: TFile): string {
		const name = this.generateFileName(original);
		const folderPath = this.determineFolderPath(original);
		return normalizePath(`${folderPath}/${name}`);
	}

	private generateFileName(original: TFile): string {
		const settings = this.getSettings();
		const namingPattern = settings.namingPattern || DEFAULT_NAMING_PATTERN;
		return namingPattern
			.replaceAll('{{originalName}}', original.basename)
			.replaceAll('{{originalExt}}', original.extension)
			.replaceAll('{{date}}', moment().format('YYYY-MM-DD'));
	}

	private determineFolderPath(original: TFile): string {
		const settings = this.getSettings();

		// 1. Custom folder - самый простой кейс
		if (settings.storageLocation === 'custom-folder') {
			return settings.customStoragePath ?? '';
		}

		const root = this.app.vault.getRoot();

		// Получаем "папку, содержащую оригинал"
		// Если оригинал в корне, originalFolder = root
		const originalFolder = original.parent || root;

		// Получаем "родителя папки оригинала"
		// Если originalFolder = root, то parent = null.
		const originalParent = originalFolder.parent;

		// Получаем активный файл и его структуру
		const activeFile = this.app.workspace.getActiveFile();
		const activeFolder = activeFile ? (activeFile.parent || root) : null;

		// activeGrandParent - это папка НАД активным файлом
		// Если активный файл в корне (activeFolder=root), то grandParent=null
		const activeGrandParent = activeFolder ? activeFolder.parent : null;

		let target: TFolder | null = null;

		switch (settings.storageLocation) {
			case 'same-folder':
				// Рядом с файлом
				target = originalFolder;
				break;

			case 'vault-root':
				// Всегда в корень
				target = root;
				break;

			case 'original-parent-folder':
				// На уровень выше оригинала
				// Если оригинал уже в корне (originalFolder=root, parent=null), то остаемся в корне
				target = originalParent ?? root;
				break;

			case 'active-file-folder':
				// Рядом с активным файлом
				// Если активного нет -> рядом с оригиналом
				target = activeFolder ?? originalFolder;
				break;

			case 'active-parent-folder':
				// На уровень выше активного файла
				if (activeFile && activeFolder) {
					// Если активный файл лежит в корне (activeFolder=root), то подняться выше нельзя -> root
					// Если активный файл в Folder (activeFolder=Folder), то activeGrandParent -> root (или выше)
					target = activeGrandParent ?? root;
				} else {
					// Если активного нет -> на уровень выше оригинала
					target = originalParent ?? root;
				}
				break;

			default:
				console.error(`Unknown storage location: ${settings.storageLocation}`);
				new Notice(`Sidecar Error: Unknown storage location setting.`);
				target = root; // fallback
		}

		return target ? target.path : '';
	}
}
