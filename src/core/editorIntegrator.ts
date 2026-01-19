import { type App, MarkdownView, Editor } from 'obsidian';
import type { SidecarCreatorSettings } from '../settings';

export class EditorIntegrator {
	constructor(private app: App, private settings: SidecarCreatorSettings) {}

	public insertLinkToSidecar(sidecarName: string) {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		const editor = view.editor;
		const link = this.settings.alwaysShowEmbedLinks ? `![[${sidecarName}]]` : `[[${sidecarName}]]`;

		this.insertAtCursor(editor, link);

		if (this.settings.removeEmptyLinesBetweenLinks) {
			this.cleanupEmptyLines(editor);
		}
	}

	public swapOriginalLinkWithSidecar(originalName: string, sidecarName: string) {
		// TODO: Implement logic to find [[originalName]] in active note and replace with [[sidecarName]]
	}

	private insertAtCursor(editor: Editor, text: string) {
		editor.replaceSelection(text);
	}

	/**
	 * Удаляет двойные пустые строки в выделении или вокруг курсора,
	 * если пользователь массово вставляет файлы.
	 * Примечание: Это базовая реализация. Полная зачистка при Drag&Drop сложнее,
	 * так как нужно перехватывать событие drop.
	 * Пока что реализуем это как пост-обработку текущей строки/блока.
	 */
	private cleanupEmptyLines(editor: Editor) {
		const cursor = editor.getCursor();
		// Проверяем строку выше. Если она пустая, и строка над ней пустая или содержит ссылку...
		// Тут нужно думать, как именно триггерить это при массовой вставке.
		// Если это происходит в цикле, editor changes могут конфликтовать.
		// Пока оставим заглушку, так как логика Drag&Drop перехвата требует отдельного Event Listener.
	}
}
