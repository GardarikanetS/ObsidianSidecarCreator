import { Setting } from 'obsidian';
import type { SettingsCtx } from '../../types';
import { t } from '../../../../i18n';

export function renderSidecarModifySettings(container: HTMLElement, ctx: SettingsCtx) {
	const { plugin } = ctx;

	container.createEl('h3', { text: 'Modifications & Deletion' });

	// Conflict resolution (WIP)
	new Setting(container)
		.setName(t('settings.automation.conflictResolution'))
		.setDisabled(true)
		.addDropdown((d) =>
			d
				.addOption('manual', t('settings.automation.conflictResolution.manual'))
				.setValue(plugin.settings.conflictResolution)
				.setDisabled(true)
				.onChange(async (v) => {
					plugin.settings.conflictResolution = v as any;
					await plugin.saveSettings();
				})
		);

	// On delete (WIP)
	new Setting(container)
		.setName(t('settings.automation.onDelete'))
		.setDisabled(true)
		.addDropdown((d) =>
			d
				.addOption('ask', t('settings.automation.onDelete.ask'))
				.setValue(plugin.settings.deleteBehavior)
				.setDisabled(true)
				.onChange(async (v) => {
					plugin.settings.deleteBehavior = v as any;
					await plugin.saveSettings();
				})
		);
}
