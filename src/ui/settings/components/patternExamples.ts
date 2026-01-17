import { t } from '../../../i18n';

export function renderPatternExamples(container: HTMLElement) {
	const row = container.createDiv();
	row.style.display = 'flex';
	row.style.justifyContent = 'space-between';
	row.style.alignItems = 'baseline';
	row.style.marginTop = '6px';

	row.createEl('div', { text: t('settings.patterns.exampleLabel'), cls: 'setting-item-description' });

	const link = row.createEl('a', {
		text: t('settings.patterns.docsLink'),
		href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions',
	});
	link.style.fontSize = '12px';
	link.style.whiteSpace = 'nowrap';

	const ex = container.createDiv({ cls: 'setting-item-description' });
	ex.createDiv({ text: t('settings.patterns.ex1') });
	ex.createDiv({ text: t('settings.patterns.ex2') });
	ex.createDiv({ text: t('settings.patterns.ex3') });
}
