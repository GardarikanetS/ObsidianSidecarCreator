import type { TFile } from 'obsidian';

export async function markInSidecar(sidecarFile: TFile): Promise<void> {
	console.log(`[Sidecar Creator][markInSidecar] Заглушка для ${sidecarFile.path}`);
}
