import { Editor, TFile } from 'obsidian';

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class AutoEmbed {
	public insertLink(editor: Editor, sidecar: TFile, forceEmbed: boolean) {
		const prefix = forceEmbed ? '!' : '';
		const link = `${prefix}[[${sidecar.name}]]`;
		editor.replaceSelection(link);
	}

	public removeEmbedPrefix(editor: Editor, original: TFile, sidecar: TFile): boolean {
		const cursor = editor.getCursor();
		const lookback = 8;

		const namesToCheck = [sidecar.name, original.name];

		for (const name of namesToCheck) {
			const escapedName = escapeRegExp(name);
			const embedRegex = new RegExp(`!\\[\\[${escapedName}(\\|[^\\]]+)?\\]\\]`);

			for (let i = 0; i <= lookback; i++) {
				const lineNo = cursor.line - i;
				if (lineNo < 0) break;

				const line = editor.getLine(lineNo);
				const match = line.match(embedRegex);

				if (match && typeof match.index === 'number') {
					const full = match[0];
					const alias = match[1] ?? '';
					const startCh = match.index;
					const endCh = startCh + full.length;

					const replacement = `[[${name}${alias}]]`;

					editor.replaceRange(
						replacement,
						{ line: lineNo, ch: startCh },
						{ line: lineNo, ch: endCh }
					);
					return true;
				}
			}
		}

		return false;
	}
}
