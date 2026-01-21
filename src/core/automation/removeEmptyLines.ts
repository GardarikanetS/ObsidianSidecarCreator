import { Editor } from 'obsidian';

export class RemoveEmptyLines {
	/**
	 * Умная очистка: удаляет пустую строку выше, ТОЛЬКО если строка над ней
	 * похожа на ссылку ([[...]] или ![[...]]).
	 */
	public cleanup(editor: Editor) {
		const cursor = editor.getCursor();
		const lineIdx = cursor.line;

		// Нам нужно как минимум 2 строки выше
		if (lineIdx < 2) return;

		const prevLineIdx = lineIdx - 1;
		const prePrevLineIdx = lineIdx - 2;

		const prevLine = editor.getLine(prevLineIdx);
		const prePrevLine = editor.getLine(prePrevLineIdx);

		// Если предыдущая строка пустая (или пробелы)
		if (prevLine.trim() === '') {
			const trimmedPrePrev = prePrevLine.trim();
			// И строка ПЕРЕД ней начинается как ссылка
			if (trimmedPrePrev.startsWith('![[') || trimmedPrePrev.startsWith('[[')) {
				// Удаляем пустую строку
				editor.replaceRange('', { line: prevLineIdx, ch: 0 }, { line: lineIdx, ch: 0 });
			}
		}
	}
}
