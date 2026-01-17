import { t } from '../../../i18n';

export function renderPatternExamples(container: HTMLElement) {
	// Создаем контейнер-описание, такой же как у списка переменных
	const wrapper = container.createDiv({ cls: 'setting-item-description' });
	wrapper.style.marginTop = '6px';
	wrapper.style.marginBottom = '12px';

	// Верхняя строка: "Example:" слева, ссылка справа
	const header = wrapper.createDiv();
	header.style.marginBottom = '6px';
	header.style.display = 'flex';
	header.style.justifyContent = 'space-between';
	header.style.alignItems = 'baseline';

	// Убираем звездочки из ключа "*Example:*", если они там есть, для чистоты
	// Или просто выводим текст. (В i18n у нас "*Example:*")
	const exampleLabel = t('settings.patterns.exampleLabel').replace(/\*/g, '');
	header.createSpan({ text: exampleLabel });

	const link = header.createEl('a', {
		text: t('settings.patterns.docsLink'),
		href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions',
	});
	link.style.fontSize = '12px';
	link.style.whiteSpace = 'nowrap';

	// Список
	const ul = wrapper.createEl('ul');
	ul.style.margin = '0';
	ul.style.paddingLeft = '18px';

	const examples = [
		'settings.patterns.ex1',
		'settings.patterns.ex2',
		'settings.patterns.ex3',
	];

	for (const key of examples) {
		const li = ul.createEl('li');
		// Рендерим простую разметку (жирный и код) через innerHTML,
		// чтобы **Prefix** стало жирным, а `code` — кодом.
		li.innerHTML = parseMiniMarkdown(t(key));
	}
}

// Простой парсер для визуального соответствия
function parseMiniMarkdown(text: string): string {
	return text
		.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // **bold** -> <b>bold</b>
		.replace(/`(.*?)`/g, '<code>$1</code>'); // `code` -> <code>code</code>
}
