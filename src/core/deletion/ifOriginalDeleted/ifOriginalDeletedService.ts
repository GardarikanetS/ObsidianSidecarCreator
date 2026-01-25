import { App, Notice, TFile } from 'obsidian';

export class IfOriginalDeletedService {
	constructor(private app: App) {}

	async handleOriginalDeleted(originalFile: TFile, sidecarFile: TFile): Promise<void> {
		console.log(
			`[Sidecar Creator][ifOriginalDeleted] Получено событие: original=${originalFile.path}, sidecar=${sidecarFile.path}`
		);
		new Notice(`[Sidecar Creator] Оригинал удален, sidecar: ${sidecarFile.path}`);
	}
}
