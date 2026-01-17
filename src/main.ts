import { Plugin, TFile } from 'obsidian';
import { DEFAULT_SETTINGS, type SidecarCreatorSettings } from './settings';
import { SidecarService } from './core/sidecarService';
import { shouldCreateSidecarForFile } from './core/fileClassifier';
import { SidecarCreatorSettingTab } from './ui/settings/settingsTab';
import { RenameSyncService } from './core/renameSync';

export default class SidecarCreatorPlugin extends Plugin {
	settings!: SidecarCreatorSettings;
	private sidecarService!: SidecarService;
	private renameSyncService!: RenameSyncService;

	async onload() {
		await this.loadSettings();

		// Init services
		this.sidecarService = new SidecarService(this.app, this.settings);
		this.renameSyncService = new RenameSyncService(this.app, this.settings);

		// Register Settings UI
		this.addSettingTab(new SidecarCreatorSettingTab(this.app, this));

		// 1. Create Event (Auto-create sidecar)
		this.registerEvent(
			this.app.vault.on('create', async (file) => {
				if (!(file instanceof TFile)) return;
				if (!this.settings.importEnabled) return;
				if (!shouldCreateSidecarForFile(file, this.settings)) return;

				await this.sidecarService.ensureSidecarFor(file);
			})
		);

		// 2. Rename Event (Sync names)
		this.registerEvent(
			this.app.vault.on('rename', async (file, oldPath) => {
				await this.renameSyncService.handleRename(file, oldPath);
			})
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
