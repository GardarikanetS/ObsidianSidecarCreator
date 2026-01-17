import { Setting } from 'obsidian';
import type { SettingsCtx } from '../types';
import { renderFilterBlock } from '../components/filterBlock';

export function renderFiltersTab(
	container: HTMLElement,
	ctx: SettingsCtx,
	rerender: () => void
) {
	const { plugin } = ctx;

	container
		.createEl('h3', { text: 'Obsidian import' })
		.style.borderBottom = 'none';

	// Enable creation on import moved to Automation (per requirements)
	void renderFilterBlock(
		container,
		{
			enableCanvas: {
				get: () => plugin.settings.importEnableCanvas,
				set: (v) => (plugin.settings.importEnableCanvas = v),
			},
			enableBases: {
				get: () => plugin.settings.importEnableBases,
				set: (v) => (plugin.settings.importEnableBases = v),
			},
			listMode: {
				get: () => plugin.settings.importListMode,
				set: (v) => (plugin.settings.importListMode = v),
			},
			patterns: {
				get: () => plugin.settings.importPatterns,
				set: (v) => (plugin.settings.importPatterns = v),
			},
		},
		async () => plugin.saveSettings()
	);

	container
		.createEl('h3', { text: 'Vault scan' })
.style.borderBottom = 'none';

	new Setting(container)
		.setName('Sync with obsidian import')
		.addToggle((t) =>
			t.setValue(plugin.settings.scanSyncWithImport).onChange(async (v) => {
				plugin.settings.scanSyncWithImport = v;
				await plugin.saveSettings();
				rerender();
			})
		)
		.settingEl.style.borderBottom = 'none';

	if (plugin.settings.scanSyncWithImport) {
		container.createDiv({
			cls: 'setting-item-description',
			text: 'Using the same filters as Obsidian import.',
		});
		return;
	}

	void renderFilterBlock(
		container,
		{
			enableCanvas: {
				get: () => plugin.settings.scanEnableCanvas,
				set: (v) => (plugin.settings.scanEnableCanvas = v),
			},
			enableBases: {
				get: () => plugin.settings.scanEnableBases,
				set: (v) => (plugin.settings.scanEnableBases = v),
			},
			listMode: {
				get: () => plugin.settings.scanListMode,
				set: (v) => (plugin.settings.scanListMode = v),
			},
			patterns: {
				get: () => plugin.settings.scanPatterns,
				set: (v) => (plugin.settings.scanPatterns = v),
			},
		},
		async () => plugin.saveSettings()
	);
}
