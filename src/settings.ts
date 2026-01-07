import { DEFAULT_TEMPLATE } from './assets/defaultTemplate'; // Import the constant

export type ListMode = 'blacklist' | 'whitelist';

export interface SidecarCreatorSettings {
	importEnabled: boolean;
	importListMode: ListMode;
	importPatterns: string;
	importEnableCanvas: boolean;
	importEnableBases: boolean;

	// Naming & Templates
	namingPattern: string;
	storageLocation: string;
	templateEngine: string;
	templateContent: string; // <-- New field

	// Automation
	autoScanOnStartup: boolean;
	conflictResolution: string;
	deleteBehavior: string;

	// ...other fields if needed
	language: string;
}

export const DEFAULT_SETTINGS: SidecarCreatorSettings = {
	importEnabled: true,
	importListMode: 'blacklist',
	importPatterns: [
		'^\\..*',
		'^~\\$.*',
		'.*\\.bak$',
		'.*~$'
	].join('\n'),
	importEnableCanvas: false,
	importEnableBases: false,

	namingPattern: '{{originalName}}.{{originalExt}}.md',
	storageLocation: 'same-folder',
	templateEngine: 'builtin',

	templateContent: DEFAULT_TEMPLATE, // <-- Use imported default

	autoScanOnStartup: false,
	conflictResolution: 'sync',
	deleteBehavior: 'ask',
	language: 'en',
};
