import { App, Notice, TFile } from 'obsidian';
import type { SidecarCreatorSettings } from '../../../settings';
import { deleteOriginal } from './deleteOriginal';

export class IfSidecarDeletedService {
	constructor(private app: App, private getSettings: () => SidecarCreatorSettings) {}

	async handleSidecarDeleted(sidecarFile: TFile, originalFile: TFile): Promise<void> {
		console.log(
			`[Sidecar Creator][ifSidecarDeleted] Получено событие: sidecar=${sidecarFile.path}, original=${originalFile.path}`
		);
		const behavior = this.getSettings().deleteSidecarBehavior;
		console.log(`[Sidecar Creator][ifSidecarDeleted] Выбранное поведение: ${behavior}`);

		if (behavior === 'delete') {
			console.log('[Sidecar Creator][ifSidecarDeleted] Удаляем оригинал.');
			await deleteOriginal(this.app, originalFile);
			return;
		}

		if (behavior === 'none') {
			console.log('[Sidecar Creator][ifSidecarDeleted] Ничего не делаем.');
			return;
		}

		new Notice('[Sidecar Creator] Неизвестное поведение при удалении sidecar.');
	}
}
