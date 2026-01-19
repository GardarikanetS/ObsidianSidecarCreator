import type { TFile } from 'obsidian';
import type { SidecarCreatorSettings } from '../settings';
import { DEFAULT_TEMPLATE } from '../assets/defaultTemplate';

export class TemplateManager {
	constructor(private settings: SidecarCreatorSettings) {}

	public async generateContent(original: TFile): Promise<string> {
		switch (this.settings.templateEngine) {
			case 'templater':
				return this.generateTemplaterContent(original);
			case 'core-templates':
				return this.generateCoreTemplatesContent(original);
			case 'builtin':
			default:
				return this.generateBuiltinContent(original);
		}
	}

	private generateBuiltinContent(original: TFile): string {
		const tpl = this.settings.templateContent || DEFAULT_TEMPLATE;
		const originalWiki = original.name.replaceAll(']]', '\\]\\]');

		return tpl
			.replaceAll('{{originalWiki}}', originalWiki);
		// В будущем можно добавить сюда {{date}} и другие переменные, если они нужны в теле
	}

	private async generateTemplaterContent(original: TFile): Promise<string> {
		// TODO: Implement Templater integration
		// Нужно будет звать API Templater'а
		console.warn('Templater engine is not implemented yet, using builtin fallback');
		return this.generateBuiltinContent(original);
	}

	private async generateCoreTemplatesContent(original: TFile): Promise<string> {
		// TODO: Implement Core Templates integration
		console.warn('Core Templates engine is not implemented yet, using builtin fallback');
		return this.generateBuiltinContent(original);
	}
}
