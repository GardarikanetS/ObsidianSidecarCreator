import { PluginSettingTab, App } from 'obsidian';
import type SidecarCreatorPlugin from '../../main'; // Импортируем тип плагина
import type { TabId, SettingsCtx } from './types';
import { renderFiltersTab } from './tabs/filtersTab';
import { renderNamingTemplatesTab } from './tabs/namingTemplatesTab';
import { renderAutomationTab } from './tabs/automationTab';
import { renderInterfaceTab } from './tabs/interfaceTab';

export class SidecarCreatorSettingTab extends PluginSettingTab {
	plugin: SidecarCreatorPlugin; // <-- Добавлено свойство
	private activeTab: TabId = 'filters';

	constructor(app: App, plugin: SidecarCreatorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Sidecar Creator' });

		const tabHeader = containerEl.createDiv();
		tabHeader.style.borderBottom = '1px solid var(--background-modifier-border)';
		tabHeader.style.marginBottom = '16px';
		tabHeader.style.display = 'flex';
		tabHeader.style.flexWrap = 'wrap';
		tabHeader.style.gap = '2px';

		this.renderTabButton(tabHeader, 'filters', 'File filters');
		this.renderTabButton(tabHeader, 'naming', 'Naming & templates');
		this.renderTabButton(tabHeader, 'automation', 'Automation');
		this.renderTabButton(tabHeader, 'interface', 'Interface');

		const tabContainer = containerEl.createDiv();

		const ctx: SettingsCtx = { app: this.app, plugin: this.plugin };

		// Исправлены вызовы: убрал третий аргумент там, где он, скорее всего, не поддерживается в функциях.
		// Если ты хочешь, чтобы Automation и Interface поддерживали перерисовку, нужно править ИХ файлы.
		// Пока что просто приведем вызов к текущим сигнатурам.

		if (this.activeTab === 'filters') {
			renderFiltersTab(tabContainer, ctx, () => this.display());
		}
		if (this.activeTab === 'naming') {
			renderNamingTemplatesTab(tabContainer, ctx, () => this.display());
		}
		if (this.activeTab === 'automation') {
			// Если renderAutomationTab принимает 2 аргумента:
			renderAutomationTab(tabContainer, ctx);
		}
		if (this.activeTab === 'interface') {
			// Если renderInterfaceTab принимает 2 аргумента:
			renderInterfaceTab(tabContainer, ctx);
		}
	}

	private renderTabButton(parent: HTMLElement, id: TabId, text: string) {
		const btn = parent.createEl('button', { text });
		btn.style.background = 'transparent';
		btn.style.boxShadow = 'none';
		btn.style.border = 'none';
		btn.style.borderRadius = '0';
		btn.style.cursor = 'pointer';
		btn.style.padding = '8px 12px';
		btn.style.fontWeight = '600';
		btn.style.fontSize = '14px';
		btn.style.whiteSpace = 'nowrap';

		const isActive = this.activeTab === id;
		btn.style.color = isActive ? 'var(--interactive-accent)' : 'var(--text-muted)';
		btn.style.borderBottom = isActive ? '2px solid var(--interactive-accent)' : '2px solid transparent';
		btn.style.marginBottom = '-1px';

		btn.onclick = () => {
			this.activeTab = id;
			this.display();
		};
	}
}
