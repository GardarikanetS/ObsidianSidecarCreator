import type { TFile } from 'obsidian';
import type { SidecarCreatorSettings, ListMode } from '../settings';

function parsePatterns(text: string): RegExp[] {
	return text
		.split('\n')
		.map(s => s.trim())
		.filter(Boolean)
		.map(patternStr => {
			try {
				return new RegExp(patternStr, 'i');
			} catch (e) {
				console.warn(`[Sidecar Creator] Invalid RegExp: ${patternStr}`, e);
				return null;
			}
		})
		.filter((r): r is RegExp => r !== null);
}

function matchesAny(path: string, patterns: RegExp[]): boolean {
	return patterns.some(r => r.test(path));
}

function listAllows(mode: ListMode, isMatched: boolean): boolean {
	return mode === 'blacklist' ? !isMatched : isMatched;
}

export function shouldCreateSidecarForFile(file: TFile, settings: SidecarCreatorSettings): boolean {
	// Always ignore markdown
	if (file.extension.toLowerCase() === 'md') return false;

	// Check Canvas/Bases explicit toggles
	const ext = file.extension.toLowerCase();
	if (!settings.importEnableCanvas && ext === 'canvas') return false;
	if (!settings.importEnableBases && ext === 'base') return false;

	const patterns = parsePatterns(settings.importPatterns);
	// Test against the full relative path
	const isMatched = matchesAny(file.path, patterns);

	return listAllows(settings.importListMode, isMatched);
}
