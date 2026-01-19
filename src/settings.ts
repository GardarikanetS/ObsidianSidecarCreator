import { DEFAULT_TEMPLATE } from './assets/defaultTemplate';

export type ListMode = 'blacklist' | 'whitelist';

export type StorageLocation =
	| 'same-folder'
	| 'vault-root'
	| 'custom-folder'
	| 'active-file-folder'
	| 'original-parent-folder'
	| 'active-parent-folder';

export type TemplateEngine = 'builtin' | 'templater'| 'core-templates';

export type ConflictResolution = 'sync' | 'increment' | 'manual';
export type DeleteBehavior = 'delete' | 'mark' | 'ask';

export type LanguageMode = 'obsidian' | 'system' | 'custom' | string;

export const DEFAULT_NAMING_PATTERN = '{{originalName}}.{{originalExt}}.md';

export const AVAILABLE_VARS: Array<{ name: string; descKey: string }> = [
	{ name: '{{originalName}}', descKey: 'vars.naming.originalName' },
	{ name: '{{originalExt}}', descKey: 'vars.naming.originalExt' },
	{ name: '{{date}}', descKey: 'vars.naming.date' },
];

export interface SidecarCreatorSettings {
	// Import
	importEnabled: boolean;
	importListMode: ListMode;
	importPatterns: string;
	importEnableCanvas: boolean;
	importEnableBases: boolean;

	// Vault scan
	scanSyncWithImport: boolean;
	scanListMode: ListMode;
	scanPatterns: string;
	scanEnableCanvas: boolean;
	scanEnableBases: boolean;

	// Naming & templates
	namingPattern: string;
	storageLocation: StorageLocation;
	customStoragePath: string;
	templateEngine: TemplateEngine;
	templaterPath: string;
	templateContent: string;
	aboutSectionHeader: string;

	// Automation
	autoScanOnStartup: boolean;
	conflictResolution: ConflictResolution;
	deleteBehavior: DeleteBehavior;
	autoSwapLink: boolean;
	disableAutoEmbed: boolean;

	// Interface
	alwaysShowEmbedLinks: boolean;
	removeEmptyLinesBetweenLinks: boolean; // <-- NEW
	language: LanguageMode;
}

const DEFAULT_PATTERNS = [
	'^\\..*',
	'^~\\$.*',
	'.*\\.bak$',
	'.*~$',
].join('\n');

export const DEFAULT_SETTINGS: SidecarCreatorSettings = {
	importEnabled: true,
	importListMode: 'blacklist',
	importPatterns: DEFAULT_PATTERNS,
	importEnableCanvas: false,
	importEnableBases: false,

	scanSyncWithImport: true,
	scanListMode: 'blacklist',
	scanPatterns: DEFAULT_PATTERNS,
	scanEnableCanvas: false,
	scanEnableBases: false,

	namingPattern: DEFAULT_NAMING_PATTERN,
	storageLocation: 'same-folder',
	customStoragePath: '',
	templateEngine: 'builtin',
	templaterPath: '',
	templateContent: DEFAULT_TEMPLATE,
	aboutSectionHeader: 'About',

	autoScanOnStartup: false,
	conflictResolution: 'manual',
	deleteBehavior: 'ask',
	autoSwapLink: false,
	disableAutoEmbed: false,

	alwaysShowEmbedLinks: false,
	removeEmptyLinesBetweenLinks: false, // <-- NEW
	language: 'English',
};
