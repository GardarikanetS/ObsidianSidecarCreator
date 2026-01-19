import { PluginSettingTab, App } from 'obsidian';
import type SidecarCreatorPlugin from '../../main';
import { t } from '../../i18n';
import type { SettingsCtx } from './types';

import { renderFiltersTab } from './tabs/filtersTab';
import { renderNamingTemplatesTab } from './tabs/namingTemplatesTab';
import { renderAutomationTab } from './tabs/automationTab';
import { renderInterfaceTab } from './tabs/interfaceTab';

export class SidecarCreatorSettingTab extends PluginSettingTab {
	plugin: SidecarCreatorPlugin;
	activeTab: string;

	constructor(app: App, plugin: SidecarCreatorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.activeTab = 'filters';
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl('h2', { text: t('settings.title') });

		// Tab navigation
		const navContainer = containerEl.createDiv('settings-nav-container');
		navContainer.style.display = 'flex';
		navContainer.style.marginBottom = '20px';
		navContainer.style.borderBottom = '1px solid var(--background-modifier-border)';

		const tabs = [
			{ id: 'filters', label: t('settings.tabs.filters') },
			{ id: 'naming', label: t('settings.tabs.naming') },
			{ id: 'automation', label: t('settings.tabs.automation') },
			{ id: 'interface', label: t('settings.tabs.interface') },
		];

		tabs.forEach((tab) => {
			const btn = navContainer.createEl('button', { text: tab.label });
			btn.style.marginRight = '10px';
			btn.style.background = this.activeTab === tab.id ? 'var(--interactive-accent)' : '';
			btn.style.color = this.activeTab === tab.id ? 'var(--text-on-accent)' : '';
			btn.onclick = () => {
				this.activeTab = tab.id;
				this.display(); // Re-render logic
			};
		});

		// Content
		const tabContainer = containerEl.createDiv('settings-tab-content');
		const ctx: SettingsCtx = {
			app: this.app,
			plugin: this.plugin,
		};

		const rerender = () => this.display();

		switch (this.activeTab) {
			case 'filters':
				renderFiltersTab(tabContainer, ctx, rerender);
				break;
			case 'naming':
				renderNamingTemplatesTab(tabContainer, ctx, rerender);
				break;
			case 'automation':
				renderAutomationTab(tabContainer, ctx, rerender);
				break;
			case 'interface':
				// FIX: Передаем rerender третьим аргументом
				renderInterfaceTab(tabContainer, ctx, rerender);
				break;
		}
	}
}
