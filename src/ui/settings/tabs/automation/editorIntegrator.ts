import { Setting } from 'obsidian';
import type { SettingsCtx } from '../../types'; // Проверьте путь
import { t } from '../../../../i18n'; // Проверьте путь

export function renderEditorIntegratorSettings(container: HTMLElement, ctx: SettingsCtx) {
	const { plugin } = ctx;

	container.createEl('h3', { text: 'Editor Integration' }); // Можно локализовать

	// Auto swap link
	new Setting(container)
		.setName(t('settings.automation.autoSwapLink'))
		.setDesc('Automatically replace the link to the original file with the sidecar link.')
		.addToggle((t) =>
			t
				.setValue(plugin.settings.autoSwapLink)
				.onChange(async (v) => {
					plugin.settings.autoSwapLink = v;
					await plugin.saveSettings();
				})
		);

	// Disable auto embed
	new Setting(container)
		.setName(t('settings.automation.disableAutoEmbed'))
		.setDesc('Do not insert a link to the sidecar file if the original link was not swapped.')
		.addToggle((t) =>
			t
				.setValue(plugin.settings.disableAutoEmbed)
				.onChange(async (v) => {
					plugin.settings.disableAutoEmbed = v;
					await plugin.saveSettings();
				})
		);

	// Remove empty lines
	new Setting(container)
		.setName(t('settings.interface.removeEmptyLines'))
		.setDesc(t('settings.interface.removeEmptyLinesDesc'))
		.addToggle((t) =>
			t
				.setValue(plugin.settings.removeEmptyLinesBetweenLinks)
				.onChange(async (v) => {
					plugin.settings.removeEmptyLinesBetweenLinks = v;
					await plugin.saveSettings();
				})
		);
}
