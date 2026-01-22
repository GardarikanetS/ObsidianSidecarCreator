import type { TFile } from 'obsidian';
import { DEFAULT_TEMPLATE } from '../../assets/defaultTemplate';
import type { SidecarCreatorSettings } from '../../settings';

export interface TemplateEngineHandler {
	getTemplate(original: TFile): Promise<string>;
	applyTemplate(content: string, original: TFile): Promise<string>;
}

export class BuiltinTemplateEngine implements TemplateEngineHandler {
	constructor(private getSettings: () => SidecarCreatorSettings) {}

	async getTemplate(_original: TFile): Promise<string> {
		const settings = this.getSettings();
		return settings.templateContent || DEFAULT_TEMPLATE;
	}

	async applyTemplate(content: string, _original: TFile): Promise<string> {
		return content;
	}
}
