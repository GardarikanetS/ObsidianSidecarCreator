import { Editor, TFile } from 'obsidian';

export class AutoSwap {
	public swapLink(editor: Editor, original: TFile, sidecar: TFile, forceEmbed: boolean): boolean {
		const content = editor.getValue();
		// Экранируем имя файла для regex
		const escapedName = original.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		// Ищем ссылку на оригинал:
		// Группа 1 (!?): захватывает восклицательный знак (если есть)
		// Далее [[имя_файла]]
		const regex = new RegExp(`(!?)\\[\\[${escapedName}\\]\\]`, 'g');

		let hasMatch = false;

		const newContent = content.replace(regex, (match, prefix) => {
			hasMatch = true;
			// Если forceEmbed=true, всегда ставим '!'. Иначе оставляем как было.
			const finalPrefix = forceEmbed ? '!' : prefix;
			return `${finalPrefix}[[${sidecar.name}]]`;
		});

		if (hasMatch && newContent !== content) {
			editor.setValue(newContent);
			return true;
		}

		return false;
	}
}
