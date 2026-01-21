import { Editor, TFile } from 'obsidian';

export class AutoEmbed {
	public insertLink(editor: Editor, sidecar: TFile, forceEmbed: boolean) {
		const prefix = forceEmbed ? '!' : '';
		const link = `${prefix}[[${sidecar.name}]]`;
		editor.replaceSelection(link);
	}
}
