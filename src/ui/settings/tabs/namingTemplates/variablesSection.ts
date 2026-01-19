import type { SettingsCtx } from '../../types';
import { AVAILABLE_VARS } from '../../../../settings';
import { t } from '../../../../i18n';

export function renderVariablesSection(container: HTMLElement, ctx: SettingsCtx) {
	// Делаем заголовок чуть меньше или наоборот акцентируем
	container.createEl('div', {
		text: t('settings.naming.varsHeader'),
		cls: 'setting-item-name',
		attr: { style: 'margin-bottom: 8px; font-weight: bold;' }
	});

	const varsWrap = container.createDiv({ cls: 'setting-item-description' });
	varsWrap.style.marginBottom = '10px';

	const ul = varsWrap.createEl('ul');
	ul.style.marginTop = '0';
	ul.style.paddingLeft = '20px';

	for (const v of AVAILABLE_VARS) {
		const li = ul.createEl('li');
		li.style.marginBottom = '4px';

		const code = li.createEl('code', { text: v.name });
		code.style.userSelect = 'all'; // Чтобы удобно копировать кликом
		code.style.cursor = 'pointer';
		code.onclick = () => {
			navigator.clipboard.writeText(v.name);
			// Можно добавить всплывашку "Copied", но пока не будем усложнять
		};

		li.appendChild(document.createTextNode(` — ${t(v.descKey)}`));
	}
}
