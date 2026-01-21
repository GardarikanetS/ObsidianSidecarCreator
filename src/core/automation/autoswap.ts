import { Editor, TFile } from 'obsidian';

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class AutoSwap {
	public swapLink(editor: Editor, original: TFile, sidecar: TFile): boolean {
		const cursor = editor.getCursor();
		const escapedName = escapeRegExp(original.name);
		const linkRegex = new RegExp(`(!?)\\[\\[${escapedName}(\\|[^\\]]+)?\\]\\]`);

		// Ищем в пределах последних строк, куда Obsidian вставляет ссылки
		const lookback = 8;

		for (let i = 0; i <= lookback; i++) {
			const lineNo = cursor.line - i;
			if (lineNo < 0) break;

			const line = editor.getLine(lineNo);
			const match = line.match(linkRegex);

			if (match && typeof match.index === 'number') {
				const [full, bang = '', alias = ''] = match;
				const startCh = match.index;
				const endCh = startCh + full.length;
				const replacement = `${bang}[[${sidecar.name}${alias}]]`;

				editor.replaceRange(
					replacement,
					{ line: lineNo, ch: startCh },
					{ line: lineNo, ch: endCh }
				);
				return true;
			}
		}

		return false;
	}
}
