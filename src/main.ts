import { Plugin, TFile } from 'obsidian';
import { DEFAULT_SETTINGS, type SidecarCreatorSettings } from './settings';
import { SidecarService } from './core/sidecarService';
import { shouldCreateSidecarForFile } from './core/fileClassifier';
import { SidecarCreatorSettingTab } from './ui/settings/settingsTab';
import { RenameSyncService } from './core/renameSyncService';
import { setLanguage } from './i18n';
import { DeletionService } from './core/deletion/deletionService';

export default class SidecarCreatorPlugin extends Plugin {
	settings!: SidecarCreatorSettings;
	private sidecarService!: SidecarService;
	private renameSyncService!: RenameSyncService;
	private deletionAutomationService!: DeletionService;

	async onload() {
		await this.loadSettings();

		// Init services
		// Передаем стрелочную функцию, которая всегда вернет актуальные this.settings
		this.sidecarService = new SidecarService(this.app, () => this.settings);
		this.renameSyncService = new RenameSyncService(this.app, () => this.settings);
		this.renameSyncService.registerEvents(this.registerEvent.bind(this));
		this.deletionAutomationService = new DeletionService(this.app, () => this.settings);
		this.deletionAutomationService.registerEvents(this.registerEvent.bind(this));

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

		// УБРАНО: второй вызов loadSettings, который ломал ссылки на настройки
		// await this.loadSettings();

		setLanguage(this.settings.language);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
