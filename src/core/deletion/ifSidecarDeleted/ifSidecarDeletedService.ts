import { App, Notice, TFile } from 'obsidian';

export class IfSidecarDeletedService {
	constructor(private app: App) {}

	async handleSidecarDeleted(sidecarFile: TFile, originalFile: TFile): Promise<void> {
		console.log(
			`[Sidecar Creator][ifSidecarDeleted] Получено событие: sidecar=${sidecarFile.path}, original=${originalFile.path}`
		);
		new Notice(`[Sidecar Creator] Sidecar удален, оригинал: ${originalFile.path}`);
	}
}
