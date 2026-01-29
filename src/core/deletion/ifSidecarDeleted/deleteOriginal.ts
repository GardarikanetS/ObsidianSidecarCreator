import type { App, TFile } from 'obsidian';

export async function deleteOriginal(app: App, originalFile: TFile): Promise<void> {
	await app.vault.delete(originalFile);
}
