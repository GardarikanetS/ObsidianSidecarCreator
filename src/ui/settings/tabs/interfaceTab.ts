import { Setting } from 'obsidian';
import type { SettingsCtx } from '../types';

export function renderInterfaceTab(container: HTMLElement, ctx: SettingsCtx) {
	const { plugin } = ctx;

	new Setting(container)
		.setName('Always show embed links')
		.addToggle((t) =>
			t.setValue(plugin.settings.alwaysShowEmbedLinks).onChange(async (v) => {
				plugin.settings.alwaysShowEmbedLinks = v;
				await plugin.saveSettings();
			})
		);

	new Setting(container)
		.setName('Language')
		.addDropdown((d) =>
			d
				.addOption('obsidian', 'As in Obsidian')
				.addOption('system', 'As in system')
				.addOption('en', 'EN')
				.addOption('ru', 'RU')
				.addOption('custom', 'Custom')
				.setValue(plugin.settings.language)
				.onChange(async (v) => {
					plugin.settings.language = v as any;
					await plugin.saveSettings();
				})
		);
}
