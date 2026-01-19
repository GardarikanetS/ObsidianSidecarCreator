import { Setting } from 'obsidian';
import type { SettingsCtx } from '../../types';
import { DEFAULT_TEMPLATE } from '../../../../assets/defaultTemplate';
import { t } from '../../../../i18n';

export function renderTemplateSection(
	container: HTMLElement,
	ctx: SettingsCtx,
	rerender: () => void
) {
	const { plugin } = ctx;

	container.createEl('h3', { text: t('settings.template.header'), attr: { style: 'margin-top: 24px;' } });

	new Setting(container)
		.setName(t('settings.template.engine'))
		.addDropdown((d) =>
			d
				.addOption('builtin', t('settings.template.engine.builtin'))
				.addOption('core-templates', t('settings.template.engine.core'))
				.addOption('templater', t('settings.template.engine.templater'))
				.setValue(plugin.settings.templateEngine as any)
				.onChange(async (v) => {
					plugin.settings.templateEngine = v as any;
					await plugin.saveSettings();
					rerender();
				})
		);

	// Engine-specific UI
	if (plugin.settings.templateEngine === 'templater') {
		new Setting(container)
			.setName(t('settings.template.templaterPath'))
			.addText((tField) =>
				tField.setValue(plugin.settings.templaterPath).onChange(async (v) => {
					plugin.settings.templaterPath = v;
					await plugin.saveSettings();
				})
			);
	}

	// Built-in template UI
	if (plugin.settings.templateEngine === 'builtin') {
		// Кнопка сброса для шаблона
		new Setting(container)
			.setName(t('settings.template.builtinTemplate'))
			.addButton((b) =>
				b.setButtonText(t('settings.template.resetDefault')).onClick(async () => {
					plugin.settings.templateContent = DEFAULT_TEMPLATE;
					await plugin.saveSettings();
					rerender();
				})
			);

		const ta = container.createEl('textarea');
		ta.style.width = '100%';
		ta.style.height = '220px';
		ta.style.marginTop = '10px';
		ta.style.fontFamily = 'monospace';
		ta.value = plugin.settings.templateContent;
		ta.onchange = async () => {
			plugin.settings.templateContent = ta.value;
			await plugin.saveSettings();
		};
	}

	// About / Overlay header
	new Setting(container)
		.setName(t('settings.about.header'))
		.setDesc(t('settings.about.desc')) // Добавляем описание
		.addText((tField) =>
			tField.setValue(plugin.settings.aboutSectionHeader).onChange(async (v) => {
				plugin.settings.aboutSectionHeader = v;
				await plugin.saveSettings();
			})
		);
}
