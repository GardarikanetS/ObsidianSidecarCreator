import { Setting } from 'obsidian';
import type { SettingsCtx } from '../types';

export function renderAutomationTab(container: HTMLElement, ctx: SettingsCtx) {
	const { plugin } = ctx;

	new Setting(container)
		.setName('Auto-scan on startup')
		.addToggle((t) =>
			t.setValue(plugin.settings.autoScanOnStartup).onChange(async (v) => {
				plugin.settings.autoScanOnStartup = v;
				await plugin.saveSettings();
			})
		)
		.addButton((b) =>
			b.setButtonText('manual scan vault').onClick(async () => {
				// UI-only placeholder
			})
		);

	new Setting(container)
		.setName('Enable creation on import')
		.addToggle((t) =>
			t.setValue(plugin.settings.importEnabled).onChange(async (v) => {
				plugin.settings.importEnabled = v;
				await plugin.saveSettings();
			})
		);

	new Setting(container)
		.setName('Conflict resolution (if sidecar already exists)')
		.addDropdown((d) =>
			d
				.addOption('sync', 'Sync')
				.addOption('increment', 'Increment')
				.addOption('manual', 'Ask')
				.setValue(plugin.settings.conflictResolution)
				.onChange(async (v) => {
					plugin.settings.conflictResolution = v as any;
					await plugin.saveSettings();
				})
		);

	new Setting(container)
		.setName('On delete')
		.addDropdown((d) =>
			d
				.addOption('delete', 'Delete sidecar')
				.addOption('mark', 'Mark as deleted')
				.addOption('ask', 'Ask')
				.setValue(plugin.settings.deleteBehavior)
				.onChange(async (v) => {
					plugin.settings.deleteBehavior = v as any;
					await plugin.saveSettings();
				})
		);

	new Setting(container)
		.setName('Auto swap link in active file')
		.addToggle((t) =>
			t.setValue(plugin.settings.autoSwapLink).onChange(async (v) => {
				plugin.settings.autoSwapLink = v;
				await plugin.saveSettings();
			})
		);

	new Setting(container)
		.setName('Disable auto embed')
		.addToggle((t) =>
			t.setValue(plugin.settings.disableAutoEmbed).onChange(async (v) => {
				plugin.settings.disableAutoEmbed = v;
				await plugin.saveSettings();
			})
		);
}
