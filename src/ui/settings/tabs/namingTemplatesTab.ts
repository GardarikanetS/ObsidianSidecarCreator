import type { SettingsCtx } from '../types';
import { renderNamingSection } from './namingTemplates/namingSection';
import { renderVariablesSection } from './namingTemplates/variablesSection';
import { renderTemplateSection } from './namingTemplates/templateSection';

export function renderNamingTemplatesTab(
	container: HTMLElement,
	ctx: SettingsCtx,
	rerender: () => void
) {
	// 1. Секция переменных
	renderVariablesSection(container, ctx);

	// Разделитель
	const hr1 = container.createEl('hr');
	hr1.style.marginTop = '20px';
	hr1.style.marginBottom = '20px';
	hr1.style.border = 'none';
	hr1.style.borderTop = '1px solid var(--background-modifier-border)';

	// 2. Секция имен и путей
	renderNamingSection(container, ctx, rerender);

	// Разделитель
	const hr2 = container.createEl('hr');
	hr2.style.marginTop = '20px';
	hr2.style.marginBottom = '20px';
	hr2.style.border = 'none';
	hr2.style.borderTop = '1px solid var(--background-modifier-border)';

	// 3. Секция шаблона контента
	renderTemplateSection(container, ctx, rerender);
}
