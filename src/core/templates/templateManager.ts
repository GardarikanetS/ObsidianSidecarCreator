import type { App, TFile } from 'obsidian';
import type { SidecarCreatorSettings } from '../../settings';
import { applyTemplateVariables, buildTemplateVariables } from '../templateVariables';
import { BuiltinTemplateEngine } from './builtinTemplateEngine';
import { CoreTemplatesTemplateEngine } from './coreTemplatesTemplateEngine';
import { TemplaterTemplateEngine } from './templaterTemplateEngine';

export class TemplateManager {
	private builtinEngine: BuiltinTemplateEngine;
	private templaterEngine: TemplaterTemplateEngine;
	private coreTemplatesEngine: CoreTemplatesTemplateEngine;

	constructor(private app: App, private getSettings: () => SidecarCreatorSettings) {
		this.builtinEngine = new BuiltinTemplateEngine(getSettings);
		this.templaterEngine = new TemplaterTemplateEngine(app, getSettings, this.builtinEngine);
		this.coreTemplatesEngine = new CoreTemplatesTemplateEngine(app, getSettings, this.builtinEngine);
	}

	public async generateContent(original: TFile): Promise<string> {
		const settings = this.getSettings();
		const engine = this.resolveEngine(settings.templateEngine);

		const baseTemplate = await engine.getTemplate(original);
		const withVars = applyTemplateVariables(baseTemplate, buildTemplateVariables(original));

		return engine.applyTemplate(withVars, original);
	}

	private resolveEngine(engine: SidecarCreatorSettings['templateEngine']) {
		switch (engine) {
			case 'templater':
				return this.templaterEngine;
			case 'core-templates':
				return this.coreTemplatesEngine;
			case 'builtin':
			default:
				return this.builtinEngine;
		}
	}
}
