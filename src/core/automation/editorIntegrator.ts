import { type App, MarkdownView, TFile } from 'obsidian';
import type { SidecarCreatorSettings } from '../../settings'; // Проверьте путь импорта
import { AutoSwap } from './autoswap';
import { AutoEmbed } from './disableAutoEmbeds';
import { RemoveEmptyLines } from './removeEmptyLines';

export class EditorIntegrator {
	private autoSwap: AutoSwap;
	private autoEmbed: AutoEmbed;
	private removeEmptyLines: RemoveEmptyLines;

	constructor(private app: App, private getSettings: () => SidecarCreatorSettings) {
		this.autoSwap = new AutoSwap();
		this.autoEmbed = new AutoEmbed();
		this.removeEmptyLines = new RemoveEmptyLines();
	}

	public async performFileInsertion(original: TFile, sidecar: TFile) {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		const editor = view.editor;
		const settings = this.getSettings();

		// Ждем завершения нативной вставки
		await new Promise(resolve => setTimeout(resolve, 150));

		let replaced = false;

		// 1. Auto Swap
		if (settings.autoSwapLink) {
			replaced = this.autoSwap.swapLink(
				editor,
				original,
				sidecar,
				settings.alwaysShowEmbedLinks
			);
		}

		// 2. Auto Embed
		// Вставляем, если НЕ заменили и если вставка НЕ отключена
		if (!replaced && !settings.disableAutoEmbed) {
			this.autoEmbed.insertLink(
				editor,
				sidecar,
				settings.alwaysShowEmbedLinks
			);
		}

		// 3. Remove Empty Lines
		if (settings.removeEmptyLinesBetweenLinks) {
			this.removeEmptyLines.cleanup(editor);
		}
	}
}
