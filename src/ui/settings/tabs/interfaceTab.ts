import { Setting } from 'obsidian';
import type { SettingsCtx } from '../types';
import { t, AVAILABLE_LOCALES } from '../../../i18n';
import { setLanguage } from '../../../i18n';

export function renderInterfaceTab(container: HTMLElement, ctx: SettingsCtx) {
	const { plugin } = ctx;

	new Setting(container)
		.setName(t('settings.interface.alwaysShowEmbedLinks'))
		.addToggle((t) =>
			t.setValue(plugin.settings.alwaysShowEmbedLinks).onChange(async (v) => {
				plugin.settings.alwaysShowEmbedLinks = v;
				await plugin.saveSettings();
			})
		);

	new Setting(container)
		.setName(t('settings.interface.language'))
		.addDropdown((d) => {
			d.addOption('obsidian', t('settings.interface.language.obsidian'));
			d.addOption('system', t('settings.interface.language.system'));
			d.addOption('custom', t('settings.interface.language.custom'));

			// Динамически добавляем языки из списка доступных
			AVAILABLE_LOCALES.forEach((lang) => {
				d.addOption(lang, lang);
			});

			d.setValue(plugin.settings.language);

			d.onChange(async (v) => {
				plugin.settings.language = v;
				setLanguage(v);
				await plugin.saveSettings();
			});
		});
}
