import type { App } from 'obsidian';
import type SidecarCreatorPlugin from '../../main';

export type TabId = 'filters' | 'naming' | 'automation' | 'interface';

export type SettingsCtx = {
	app: App;
	plugin: SidecarCreatorPlugin;
};
