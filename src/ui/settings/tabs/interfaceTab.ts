import { Setting } from 'obsidian';
import type { SettingsCtx } from '../types';
import { t, setLanguage, STATIC_LANG_OPTIONS, AVAILABLE_LOCALES } from '../../../i18n';

export function renderInterfaceTab(
	container: HTMLElement,
	ctx: SettingsCtx,
	rerender: () => void
) {
	const { plugin } = ctx;

	// Language
	new Setting(container)
		.setName(t('settings.interface.language'))
		.addDropdown((d) => {
			// Static options
			STATIC_LANG_OPTIONS.forEach(opt =>
				d.addOption(opt, t(`settings.interface.language.${opt}`))
			);
			// Loaded locales
			AVAILABLE_LOCALES.forEach(lang => d.addOption(lang, lang));

			d.setValue(plugin.settings.language);
			d.onChange(async (v) => {
				plugin.settings.language = v;
				setLanguage(v);
				await plugin.saveSettings();
				rerender(); // Re-render all tabs to apply language
			});
		});

	// Always show embed
	new Setting(container)
		.setName(t('settings.interface.alwaysShowEmbedLinks'))
		.addToggle((t) =>
			t
				.setValue(plugin.settings.alwaysShowEmbedLinks)
				.onChange(async (v) => {
					plugin.settings.alwaysShowEmbedLinks = v;
					await plugin.saveSettings();
				})
		);


}
