import { App, PluginSettingTab, Setting } from 'obsidian';
import type SidecarCreatorPlugin from '../main';
import { t } from '../i18n';
import { DEFAULT_TEMPLATE } from '../assets/defaultTemplate';

type TabId = 'general' | 'naming' | 'automation';

export class SidecarCreatorSettingTab extends PluginSettingTab {
	plugin: SidecarCreatorPlugin;
	activeTab: TabId = 'general';

	constructor(app: App, plugin: SidecarCreatorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('h2', { text: 'Sidecar Creator' });

		// --- TAB HEADER ---
		// Исправлено: flex-wrap для мобилок/узких экранов, gap убран
		const tabHeader = containerEl.createDiv();
		tabHeader.style.borderBottom = '1px solid var(--background-modifier-border)';
		tabHeader.style.paddingBottom = '0';
		tabHeader.style.marginBottom = '20px';
		tabHeader.style.display = 'flex';
		tabHeader.style.flexWrap = 'wrap'; // Чтобы переносилось, если узко
		tabHeader.style.gap = '2px'; // Минимальный зазор

		this.renderTabButton(tabHeader, 'general', 'General');
		this.renderTabButton(tabHeader, 'naming', 'Naming & Templates');
		this.renderTabButton(tabHeader, 'automation', 'Automation');

		// --- TAB CONTENT ---
		const tabContainer = containerEl.createDiv();
		if (this.activeTab === 'general') this.renderGeneralTab(tabContainer);
		else if (this.activeTab === 'naming') this.renderNamingTab(tabContainer);
		else if (this.activeTab === 'automation') this.renderAutomationTab(tabContainer);
	}

	private renderTabButton(parent: HTMLElement, id: TabId, text: string) {
		const btn = parent.createEl('button', { text });
		// Сброс стилей кнопки для вида "вкладки"
		btn.style.background = 'transparent';
		btn.style.boxShadow = 'none'; // Убираем тень кнопки Obsidian
		btn.style.border = 'none';
		btn.style.borderRadius = '0'; // Квадратные углы снизу
		btn.style.cursor = 'pointer';

		btn.style.padding = '8px 16px';
		btn.style.fontWeight = '600';
		btn.style.fontSize = '14px';
		btn.style.whiteSpace = 'nowrap'; // Чтобы текст не ломался

		const isActive = this.activeTab === id;
		btn.style.color = isActive ? 'var(--interactive-accent)' : 'var(--text-muted)';
		btn.style.borderBottom = isActive ? '2px solid var(--interactive-accent)' : '2px solid transparent';
		btn.style.marginBottom = '-1px'; // Наложение на линию

		btn.onclick = () => {
			this.activeTab = id;
			this.display();
		};
	}

	// --- GENERAL TAB ---
	private renderGeneralTab(container: HTMLElement) {

		// 1. Special Types (Без лишних линий)
		new Setting(container)
			.setName('Enable sidecar for Canvas files (.canvas)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.importEnableCanvas)
				.onChange(async (v) => {
					this.plugin.settings.importEnableCanvas = v;
					await this.plugin.saveSettings();
				}));

		new Setting(container)
			.setName('Enable sidecar for Bases files (.base)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.importEnableBases)
				.onChange(async (v) => {
					this.plugin.settings.importEnableBases = v;
					await this.plugin.saveSettings();
				}));

		// 2. Patterns Section
		// Убрал <hr>, просто заголовок с отступом
		container.createEl('h3', { text: t('settingsPatterns'), attr: { style: 'margin-top: 30px;' } });

		// Filter Mode
		new Setting(container)
			.setName(t('settingsListMode'))
			.addDropdown(dropdown => dropdown
				.addOption('blacklist', 'Blacklist (Exclude)')
				.addOption('whitelist', 'Whitelist')
				.setValue(this.plugin.settings.importListMode)
				.onChange(async (value) => {
					this.plugin.settings.importListMode = value as 'blacklist' | 'whitelist';
					await this.plugin.saveSettings();
				}));

		const descEl = container.createDiv({ cls: 'setting-item-description' });
		descEl.createSpan({ text: 'One RegExp per line. ' });
		descEl.createEl('a', {
			text: 'RegExp Reference',
			href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions'
		});

		const ul = descEl.createEl('ul');
		ul.style.marginTop = '8px';
		ul.style.paddingLeft = '20px';
		ul.style.color = 'var(--text-muted)';
		ul.createEl('li').innerHTML = 'Hidden files: <code>^\\..*</code>';
		ul.createEl('li').innerHTML = 'All JPGs: <code>.*\\.jpg$</code>';
		ul.createEl('li').innerHTML = 'Prefix "Backup": <code>^Backup.*</code>';

		const textAreaControl = container.createEl('textarea');
		textAreaControl.style.width = '100%';
		textAreaControl.style.height = '150px';
		textAreaControl.style.marginTop = '10px';
		textAreaControl.style.fontFamily = 'monospace';
		textAreaControl.value = this.plugin.settings.importPatterns;
		textAreaControl.onchange = async () => {
			this.plugin.settings.importPatterns = textAreaControl.value;
			await this.plugin.saveSettings();
		};
	}

	// --- NAMING TAB ---
	private renderNamingTab(container: HTMLElement) {
		new Setting(container)
			.setName('Naming Pattern')
			.setDesc('Fixed for MVP: originalName.ext.md')
			.addText(t => t.setValue(this.plugin.settings.namingPattern).setDisabled(true));

		new Setting(container)
			.setName('Storage Location')
			.addDropdown(dropdown => dropdown.addOption('same-folder', 'Same Folder').setValue('same-folder').setDisabled(true));

		new Setting(container)
			.setName('Template Engine')
			.addDropdown(dropdown => dropdown.addOption('builtin', 'Built-in').setValue('builtin').setDisabled(true));

		// Template Editor
		container.createEl('h3', { text: 'Default Template', attr: { style: 'margin-top: 30px;' } });

		const headerDiv = container.createDiv({ cls: 'setting-item' });
		headerDiv.style.padding = '0';
		headerDiv.style.border = 'none';
		const info = headerDiv.createDiv({ cls: 'setting-item-info' });
		info.createDiv({ cls: 'setting-item-description', text: 'Variables: {{originalWiki}}' });

		// Кнопка Reset
		const btnDiv = headerDiv.createDiv({ cls: 'setting-item-control' });
		const resetBtn = btnDiv.createEl('button', { text: 'Reset to Default' });
		resetBtn.onclick = async () => {
			// @ts-ignore
			this.plugin.settings.templateContent = DEFAULT_TEMPLATE;
			await this.plugin.saveSettings();
			this.display();
		};

		const templateTextArea = container.createEl('textarea');
		templateTextArea.style.width = '100%';
		templateTextArea.style.height = '200px';
		templateTextArea.style.marginTop = '10px';
		templateTextArea.style.fontFamily = 'monospace';

		// @ts-ignore
		templateTextArea.value = this.plugin.settings.templateContent || DEFAULT_TEMPLATE;
		templateTextArea.onchange = async () => {
			// @ts-ignore
			this.plugin.settings.templateContent = templateTextArea.value;
			await this.plugin.saveSettings();
		};
	}

	// --- AUTOMATION TAB ---
	private renderAutomationTab(container: HTMLElement) {
		new Setting(container)
			.setName(t('settingsCreateEnabled'))
			.setDesc(t('settingsCreateEnabledDesc'))
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.importEnabled)
				.onChange(async (value) => {
					this.plugin.settings.importEnabled = value;
					await this.plugin.saveSettings();
				}));

		new Setting(container)
			.setName('Auto-scan on startup')
			.addToggle(t => t.setValue(false).setDisabled(true));

		new Setting(container)
			.setName('Conflict Resolution')
			.addDropdown(d => d.addOption('sync', 'Sync').setValue('sync').setDisabled(true));

		new Setting(container)
			.setName('Delete Behavior')
			.addDropdown(d => d.addOption('ask', 'Ask').setValue('ask').setDisabled(true));
	}
}
