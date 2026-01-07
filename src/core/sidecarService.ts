import { normalizePath, type App, type TFile } from 'obsidian';
import type { SidecarCreatorSettings } from '../settings';
import { DEFAULT_TEMPLATE } from '../assets/defaultTemplate';

export class SidecarService {
	constructor(private app: App, private settings: SidecarCreatorSettings) {}

	getSidecarPath(original: TFile): string {
		const dir = original.parent?.path ?? '';
		const sidecarName = `${original.name}.md`;
		return normalizePath(dir ? `${dir}/${sidecarName}` : sidecarName);
	}

	async ensureSidecarFor(original: TFile): Promise<TFile | null> {
		const sidecarPath = this.getSidecarPath(original);
		const existing = this.app.vault.getAbstractFileByPath(sidecarPath);
		if (existing) return null;

		const content = this.buildContent(original);
		const created = await this.app.vault.create(sidecarPath, content);
		return created;
	}

	private buildContent(original: TFile): string {
		// Use user template OR default if empty
		const tpl = this.settings.templateContent || DEFAULT_TEMPLATE;

		const originalWiki = original.name.replaceAll(']]', '\\]\\]');
		return tpl.replaceAll('{{originalWiki}}', originalWiki);
	}
}
