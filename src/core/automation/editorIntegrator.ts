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

		// Если все автоматизации выключены — ничего не делаем (дефолтное поведение)
		if (
			!settings.autoSwapLink &&
			!settings.disableAutoEmbed &&
			!settings.removeEmptyLinesBetweenLinks
		) {
			return;
		}

		// Ждем завершения нативной вставки
		await new Promise(resolve => setTimeout(resolve, 150));

		// 1. Auto Swap
		if (settings.autoSwapLink) {
			this.autoSwap.swapLink(
				editor,
				original,
				sidecar
			);
		}

		// 2. Disable Auto Embed (убираем "!" перед вставленной ссылкой)
		if (settings.disableAutoEmbed) {
			this.autoEmbed.removeEmbedPrefix(editor, original, sidecar);
		} else if (!settings.autoSwapLink) {
			// Вставляем только если AutoSwap ВЫКЛЮЧЕН и вставка НЕ отключена
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
