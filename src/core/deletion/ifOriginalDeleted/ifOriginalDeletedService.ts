import { App, Notice, TFile } from 'obsidian';
import type { SidecarCreatorSettings } from '../../../settings';
import { deleteSidecar } from './deleteSidecar';
import { markInSidecar } from './markInSidecar';

export class IfOriginalDeletedService {
	constructor(private app: App, private getSettings: () => SidecarCreatorSettings) {}

	async handleOriginalDeleted(originalFile: TFile, sidecarFile: TFile): Promise<void> {
		console.log(
			`[Sidecar Creator][ifOriginalDeleted] Получено событие: original=${originalFile.path}, sidecar=${sidecarFile.path}`
		);
		const behavior = this.getSettings().deleteBehavior;
		console.log(`[Sidecar Creator][ifOriginalDeleted] Выбранное поведение: ${behavior}`);

		if (behavior === 'delete') {
			console.log('[Sidecar Creator][ifOriginalDeleted] Удаляем sidecar.');
			await deleteSidecar(this.app, sidecarFile);
			return;
		}

		if (behavior === 'mark') {
			console.log('[Sidecar Creator][ifOriginalDeleted] Помечаем sidecar (заглушка).');
			await markInSidecar(sidecarFile);
			return;
		}

		if (behavior === 'ask') {
			new Notice('[Sidecar Creator] Оригинал удален. Действие: спросить (пока не реализовано).');
			return;
		}

		new Notice('[Sidecar Creator] Неизвестное поведение при удалении оригинала.');
	}
}
