import en from './assets/lang/en.json';

// Simple store, defaults to EN
let currentLocale: Record<string, string> = en;

// If you implement language loading later, you'll update 'currentLocale' here

export function t(key: string, vars?: Record<string, string>): string {
	let text = currentLocale[key] || (en as Record<string, string>)[key] || key;

	if (vars) {
		for (const [k, v] of Object.entries(vars)) {
			text = text.replaceAll(`{{${k}}}`, v);
		}
	}
	return text;
}
