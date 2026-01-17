import { AbstractInputSuggest, App, TFolder } from 'obsidian';

export class VaultFolderSuggest extends AbstractInputSuggest<TFolder> {
	textInputEl: HTMLInputElement; // Сохраняем ссылку на элемент

	constructor(app: App, inputEl: HTMLInputElement) {
		super(app, inputEl);
		this.textInputEl = inputEl;
	}

	getSuggestions(query: string): TFolder[] {
		const q = query.toLowerCase();
		const folders: TFolder[] = [];

		for (const f of this.app.vault.getAllLoadedFiles()) {
			if (f instanceof TFolder) folders.push(f);
		}

		if (!q) return folders;
		return folders.filter((f) => f.path.toLowerCase().includes(q));
	}

	renderSuggestion(folder: TFolder, el: HTMLElement): void {
		el.setText(folder.path);
	}

	selectSuggestion(folder: TFolder): void {
		this.textInputEl.value = folder.path; // Используем сохраненное поле
		this.textInputEl.trigger('input');
		this.close();
	}
}
