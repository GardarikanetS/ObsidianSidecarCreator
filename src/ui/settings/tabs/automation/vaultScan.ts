import { Setting } from 'obsidian';
import type { SettingsCtx } from '../../types';
import { t } from '../../../../i18n';

export function renderVaultScanSettings(container: HTMLElement, ctx: SettingsCtx) {
	const { plugin } = ctx;

	container.createEl('h3', { text: 'Vault Scan & Import' });

	// Auto-scan (WIP)
	new Setting(container)
		.setName(t('settings.automation.autoScanOnStartup'))
		.addToggle((t) =>
			t
				.setValue(plugin.settings.autoScanOnStartup)
				.setDisabled(true)
				.setTooltip('Work in progress')
				.onChange(async (v) => {
					plugin.settings.autoScanOnStartup = v;
					await plugin.saveSettings();
				})
		)
		.addButton((b) =>
			b
				.setButtonText(t('settings.automation.manualScanVault'))
				.setDisabled(true)
				.onClick(async () => { })
		);

	// Enable creation on import
	new Setting(container)
		.setName(t('settings.automation.enableCreationOnImport'))
		.addToggle((t) =>
			t.setValue(plugin.settings.importEnabled).onChange(async (v) => {
				plugin.settings.importEnabled = v;
				await plugin.saveSettings();
			})
		);
}
