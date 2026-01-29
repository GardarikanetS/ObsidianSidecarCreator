import { Setting } from 'obsidian';
import type { SettingsCtx } from '../../types';
import { t } from '../../../../i18n';

export function renderDeletionSettings(container: HTMLElement, ctx: SettingsCtx) {
	const { plugin } = ctx;

	container.createEl('h3', { text: t('settings.automation.deletion') });

	new Setting(container)
		.setName(t('settings.automation.onDelete'))
		.addDropdown((d) =>
			d
				.addOption('ask', t('settings.automation.onDelete.ask'))
				.addOption('delete', t('settings.automation.onDelete.delete'))
				.addOption('mark', t('settings.automation.onDelete.mark'))
				.setValue(plugin.settings.deleteBehavior)
				.onChange(async (v) => {
					plugin.settings.deleteBehavior = v as any;
					await plugin.saveSettings();
				})
		);

	new Setting(container)
		.setName(t('settings.automation.onDeleteSidecar'))
		.addDropdown((d) =>
			d
				.addOption('delete', t('settings.automation.onDeleteSidecar.delete'))
				.addOption('none', t('settings.automation.onDeleteSidecar.none'))
				.setValue(plugin.settings.deleteSidecarBehavior)
				.onChange(async (v) => {
					plugin.settings.deleteSidecarBehavior = v as any;
					await plugin.saveSettings();
				})
		);
}
