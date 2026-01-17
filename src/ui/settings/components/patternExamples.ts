export function renderPatternExamples(container: HTMLElement) {
	const row = container.createDiv();
	row.style.display = 'flex';
	row.style.justifyContent = 'space-between';
	row.style.alignItems = 'baseline';
	row.style.marginTop = '6px';

	row.createEl('div', { text: '*Example:*', cls: 'setting-item-description' });

	const link = row.createEl('a', {
		text: 'JavaScript RegExp docs',
		href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions',
	});
	link.style.fontSize = '12px';
	link.style.whiteSpace = 'nowrap';

	const ex = container.createDiv({ cls: 'setting-item-description' });
	ex.createDiv({ text: '**Prefix** for `~$book.xlsx` use `^~\\$`' });
	ex.createDiv({ text: '**Suffix** for `music (wip) - 1 lvl.avi` use `wip`' });
	ex.createDiv({ text: '**Postfix** for `photo.jpg` use `\\.jpg$`' });
}
