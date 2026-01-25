import { Editor } from 'obsidian';

export class RemoveEmptyLines {
	/**
	 * Умная очистка: удаляет пустую строку выше, ТОЛЬКО если строка над ней
	 * похожа на ссылку ([[...]] или ![[...]]).
	 */
	public cleanup(editor: Editor) {
		//TODO: это сложно, позже
}}
