import {Setting} from 'obsidian';
import type {SettingsCtx} from '../types';
import {t} from '../../../i18n';

// Добавляем rerender?: () => void в аргументы
export function renderAutomationTab(
	container: HTMLElement,
	ctx: SettingsCtx,
	rerender?: () => void
) {
	const {plugin} = ctx;

	// Auto-scan (WIP)
	new Setting(container)
		.setName(t('settings.automation.autoScanOnStartup'))
		.addToggle((t) =>
			t
				.setValue(plugin.settings.autoScanOnStartup)
				.setDisabled(true) // WIP
				.setTooltip('Work in progress')
				.onChange(async (v) => {
					plugin.settings.autoScanOnStartup = v;
					await plugin.saveSettings();
				})
		)
		.addButton((b) =>
			b
				.setButtonText(t('settings.automation.manualScanVault'))
				.setDisabled(true) // WIP
				.setTooltip('Work in progress')
				.onClick(async () => {
					// UI-only placeholder
				})
		);

	// Enable creation on import (Работает)
	new Setting(container)
		.setName(t('settings.automation.enableCreationOnImport'))
		.addToggle((t) =>
			t.setValue(plugin.settings.importEnabled).onChange(async (v) => {
				plugin.settings.importEnabled = v;
				await plugin.saveSettings();
			})
		);

	const hr1 = container.createEl('hr');
	hr1.style.marginTop = '20px';
	hr1.style.marginBottom = '20px';
	hr1.style.border = 'none';
	hr1.style.borderTop = '1px solid var(--background-modifier-border)';

	// Conflict resolution (WIP)
	new Setting(container)
		.setName(t('settings.automation.conflictResolution'))
		.setDisabled(true) // WIP (блокируем заголовок)
		.setTooltip('Work in progress')
		.addDropdown((d) =>
			d
				.addOption('sync', t('settings.automation.conflictResolution.sync'))
				.addOption('increment', t('settings.automation.conflictResolution.increment'))
				.addOption('manual', t('settings.automation.conflictResolution.manual'))
				.setValue(plugin.settings.conflictResolution)
				.setDisabled(true) // WIP (блокируем контрол)
				.onChange(async (v) => {
					plugin.settings.conflictResolution = v as any;
					await plugin.saveSettings();
				})
		);

	// On delete (WIP)
	new Setting(container)
		.setName(t('settings.automation.onDelete'))
		.setDisabled(true)
		.setTooltip('Work in progress')
		.addDropdown((d) =>
			d
				.addOption('delete', t('settings.automation.onDelete.delete'))
				.addOption('mark', t('settings.automation.onDelete.mark'))
				.addOption('ask', t('settings.automation.onDelete.ask'))
				.setValue(plugin.settings.deleteBehavior)
				.setDisabled(true)
				.onChange(async (v) => {
					plugin.settings.deleteBehavior = v as any;
					await plugin.saveSettings();
				})
		);

	const hr2 = container.createEl('hr');
	hr2.style.marginTop = '20px';
	hr2.style.marginBottom = '20px';
	hr2.style.border = 'none';
	hr2.style.borderTop = '1px solid var(--background-modifier-border)';

	// Auto swap link (WIP)
	new Setting(container)
		.setName(t('settings.automation.autoSwapLink'))
		.addToggle((t) =>
			t
				.setValue(plugin.settings.autoSwapLink)
				.setDisabled(true)
				.setTooltip('Work in progress')
				.onChange(async (v) => {
					plugin.settings.autoSwapLink = v;
					await plugin.saveSettings();
				})
		);

	// Disable auto embed (WIP)
	new Setting(container)
		.setName(t('settings.automation.disableAutoEmbed'))
		.addToggle((t) =>
			t
				.setValue(plugin.settings.disableAutoEmbed)
				.setDisabled(true)
				.setTooltip('Work in progress')
				.onChange(async (v) => {
					plugin.settings.disableAutoEmbed = v;
					await plugin.saveSettings();
				})
		);
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
