
import { TFile, TAbstractFile, App } from 'obsidian';
import type { SidecarCreatorSettings } from '../settings';

export class RenameSyncService {
	private isRenaming = false;

	constructor(private app: App, private settings: SidecarCreatorSettings) {}

	async handleRename(file: TAbstractFile, oldPath: string) {
		if (this.isRenaming) return;
		if (!(file instanceof TFile)) return;

		// 1. Check if we renamed a Sidecar file
		const isSidecar = await this.isSidecarFile(file);
		if (isSidecar) {
			await this.syncOriginalToMatchSidecar(file, oldPath);
			return;
		}

		// 2. Check if we renamed an Original file
		if (file.extension !== 'md') {
			await this.syncSidecarToMatchOriginal(file, oldPath);
		}
	}

	// A: Original renamed -> Rename Sidecar
	private async syncSidecarToMatchOriginal(original: TFile, oldOriginalPath: string) {
		const oldSidecarPath = oldOriginalPath + '.md';
		const sidecar = this.app.vault.getAbstractFileByPath(oldSidecarPath);

		if (sidecar instanceof TFile) {
			const newSidecarPath = original.path + '.md';
			this.isRenaming = true;
			try {
				await this.app.fileManager.renameFile(sidecar, newSidecarPath);
			} finally {
				this.isRenaming = false;
			}
		}
	}

	// B: Sidecar renamed -> Rename Original
	private async syncOriginalToMatchSidecar(sidecar: TFile, oldSidecarPath: string) {
		// Expect sidecar name: "Image.png.md"
		if (!sidecar.name.endsWith('.md')) return;

		// oldSidecarPath: "Folder/Image.png.md" -> "Folder/Image.png"
		const oldOriginalPath = oldSidecarPath.substring(0, oldSidecarPath.length - 3);
		const original = this.app.vault.getAbstractFileByPath(oldOriginalPath);

		if (original instanceof TFile) {
			const newOriginalPath = sidecar.path.substring(0, sidecar.path.length - 3);
			this.isRenaming = true;
			try {
				await this.app.fileManager.renameFile(original, newOriginalPath);
			} finally {
				this.isRenaming = false;
			}
		}
	}

	private async isSidecarFile(file: TFile): Promise<boolean> {
		if (file.extension !== 'md') return false;

		const cache = this.app.metadataCache.getFileCache(file);
		if (!cache?.frontmatter) return false;

		const tags = cache.frontmatter.tags;
		const hasTag = Array.isArray(tags) ? tags.includes('sidecar') : tags === 'sidecar';
		const hasLink = 'sidecar_linkToOriginal' in cache.frontmatter;

		return hasTag && hasLink;
	}
}
