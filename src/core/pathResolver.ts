import { normalizePath, type App, type TFile, type TFolder, moment } from 'obsidian';
import type { SidecarCreatorSettings } from '../settings';
import { DEFAULT_NAMING_PATTERN } from '../settings';

export class PathResolver {
	constructor(private app: App, private settings: SidecarCreatorSettings) {}

	public resolvePath(original: TFile): string {
		const name = this.generateFileName(original);
		const folderPath = this.determineFolderPath(original);
		return normalizePath(`${folderPath}/${name}`);
	}

	private generateFileName(original: TFile): string {
		const namingPattern = this.settings.namingPattern || DEFAULT_NAMING_PATTERN;
		return namingPattern
			.replaceAll('{{originalName}}', original.basename)
			.replaceAll('{{originalExt}}', original.extension)
			.replaceAll('{{date}}', moment().format('YYYY-MM-DD'));
	}

	private determineFolderPath(original: TFile): string {
		if (this.settings.storageLocation === 'custom-folder') {
			return this.settings.customStoragePath ?? '';
		}

		let targetFolder: TFolder | null | undefined = null;

		const originalFolder = original.parent || this.app.vault.getRoot();
		const originalParent = originalFolder.parent;

		const activeFile = this.app.workspace.getActiveFile();
		const activeFolder = activeFile ? activeFile.parent : null;
		const activeParent = activeFolder ? activeFolder.parent : null;

		switch (this.settings.storageLocation) {
			case 'same-folder':
				targetFolder = originalFolder;
				break;
			case 'original-parent-folder':
				targetFolder = originalParent ?? originalFolder;
				break;
			case 'vault-root':
				targetFolder = this.app.vault.getRoot();
				break;
			case 'active-file-folder':
				targetFolder = activeFolder ?? originalFolder;
				break;
			case 'active-parent-folder':
				const fallback = originalParent ?? originalFolder;
				targetFolder = (activeFile && activeFolder) ? (activeParent ?? activeFolder) : fallback;
				break;
			default:
				targetFolder = originalFolder;
		}

		return targetFolder ? targetFolder.path : '';
	}
}
