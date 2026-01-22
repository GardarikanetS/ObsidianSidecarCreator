import type { App } from 'obsidian';
import { TFile } from 'obsidian';
import type { SidecarCreatorSettings } from '../../settings';
import type { TemplateEngineHandler } from './builtinTemplateEngine';

export class TemplaterTemplateEngine implements TemplateEngineHandler {
	constructor(
		private app: App,
		private getSettings: () => SidecarCreatorSettings,
		private fallbackEngine: TemplateEngineHandler,
	) {}

	async getTemplate(original: TFile): Promise<string> {
		const settings = this.getSettings();
		const templaterPath = settings.templaterPath?.trim();

		if (!templaterPath) {
			console.warn('Путь к шаблону Templater не задан — используется встроенный шаблон.');
			return this.fallbackEngine.getTemplate(original);
		}

		const templateFile = this.app.vault.getAbstractFileByPath(templaterPath);
		if (!(templateFile instanceof TFile)) {
			console.warn('Шаблон Templater не найден — используется встроенный шаблон.');
			return this.fallbackEngine.getTemplate(original);
		}

		return this.app.vault.read(templateFile);
	}

	async applyTemplate(content: string, _original: TFile): Promise<string> {
		console.warn('Интеграция с Templater пока не реализована — содержимое шаблона не обрабатывается.');
		return content;
	}
}
