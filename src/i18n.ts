import English from './assets/lang/English.json';
import Russian from './assets/lang/Russian.json';

// Чтобы добавить язык, импортируй его json-файл и добавь в объект locales
// Ключ объекта (имя языка в UI) = имя файла.
const locales: Record<string, Record<string, string>> = {
	'English': English,
	'Russian': Russian,
};

// Статические опции, которые всегда есть в дропдауне
export const STATIC_LANG_OPTIONS = ['obsidian', 'system', 'custom'];

// Список языков, доступных из файлов
export const AVAILABLE_LOCALES = Object.keys(locales);

// Текущий словарь
let currentLocale: Record<string, string> = English;

export function setLanguage(lang: string) {
	if (locales[lang]) {
		currentLocale = locales[lang];
	} else {
		currentLocale = English;
	}
}

export function t(key: string, vars?: Record<string, string>): string {
	let text = currentLocale[key] || (English as Record<string, string>)[key] || key;

	if (vars) {
		for (const [k, v] of Object.entries(vars)) {
			text = text.replaceAll(`{{${k}}}`, v);
		}
	}
	return text;
}
