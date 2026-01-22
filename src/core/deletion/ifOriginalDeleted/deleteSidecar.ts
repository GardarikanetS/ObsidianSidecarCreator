import type { App, TFile } from 'obsidian';

export async function deleteSidecar(app: App, sidecarFile: TFile): Promise<void> {
	await app.vault.delete(sidecarFile);
}
