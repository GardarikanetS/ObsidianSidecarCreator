import { DEFAULT_TEMPLATE } from './assets/defaultTemplate';

export type ListMode = 'blacklist' | 'whitelist';

export type StorageLocation = 'same-folder' | 'vault-root' | 'custom-folder' | 'active-file-folder';
export type TemplateEngine = 'builtin' | 'templater'| 'core-templates';

export type ConflictResolution = 'sync' | 'increment' | 'manual';
export type DeleteBehavior = 'delete' | 'mark' | 'ask';

export type LanguageMode = 'obsidian' | 'system' | 'en' | 'ru' | 'custom';

export const DEFAULT_NAMING_PATTERN = '{{originalName}}.{{originalExt}}.md';

export const NAMING_VARS: Array<{ name: string; desc: string }> = [
	{ name: '{{originalName}}', desc: 'Filename without extension.' },
	{ name: '{{originalExt}}', desc: 'Original file extension.' },
	{ name: '{{date}}', desc: 'Current date.' },
];
export const TEMPLATE_VARS: Array<{ name: string; desc: string }> = [
	{ name: '{{originalWiki}}', desc: 'Original file name for wiki-link usage.' },
];


export interface SidecarCreatorSettings {
	// Import (create event) — MVP uses these
	importEnabled: boolean;
	importListMode: ListMode;
	importPatterns: string;
	importEnableCanvas: boolean;
	importEnableBases: boolean;

	// Vault scan filters (UI-only for now)
	scanSyncWithImport: boolean;
	scanListMode: ListMode;
	scanPatterns: string;
	scanEnableCanvas: boolean;
	scanEnableBases: boolean;

	// Naming & templates (some are UI-only for now)
	namingPattern: string;
	storageLocation: StorageLocation;
	customStoragePath: string; // vault-relative
	templateEngine: TemplateEngine;
	templaterPath: string; // vault-relative
	templateContent: string; // editable built-in template
	aboutSectionHeader: string;

	// Automation (UI-only for now except importEnabled)
	autoScanOnStartup: boolean;
	conflictResolution: ConflictResolution;
	deleteBehavior: DeleteBehavior;
	autoSwapLink: boolean;
	disableAutoEmbed: boolean;

	// Interface (UI-only for now)
	alwaysShowEmbedLinks: boolean;
	language: LanguageMode;
}

const DEFAULT_PATTERNS = [
	'^\\..*',     // hidden
	'^~\\$.*',    // Office temp
	'.*\\.bak$',  // backups
	'.*~$',       // temp suffix
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
	conflictResolution: 'manual', // (п.9)
	deleteBehavior: 'ask',        // (п.10)
	autoSwapLink: false,
	disableAutoEmbed: false,

	alwaysShowEmbedLinks: false,
	language: 'obsidian',         // (п.11 список)
};
