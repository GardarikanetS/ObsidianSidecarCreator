import type { App, TFile } from 'obsidian';
import type { SidecarCreatorSettings } from '../../settings';
import type { TemplateEngineHandler } from './builtinTemplateEngine';

export class CoreTemplatesTemplateEngine implements TemplateEngineHandler {
	constructor(
		private _app: App,
		private _getSettings: () => SidecarCreatorSettings,
		private fallbackEngine: TemplateEngineHandler,
	) {}

	async getTemplate(original: TFile): Promise<string> {
		console.warn('Интеграция с Obsidian Templates пока не реализована — используется встроенный шаблон.');
		return this.fallbackEngine.getTemplate(original);
	}

	async applyTemplate(content: string, _original: TFile): Promise<string> {
		console.warn('Интеграция с Obsidian Templates пока не реализована — содержимое шаблона не обрабатывается.');
		return content;
	}
}
