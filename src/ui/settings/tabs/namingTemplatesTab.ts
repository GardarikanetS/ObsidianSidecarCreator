import { Setting, Notice } from 'obsidian';
import type { SettingsCtx } from '../types';
import { DEFAULT_TEMPLATE } from '../../../assets/defaultTemplate';
import { DEFAULT_NAMING_PATTERN, AVAILABLE_VARS } from '../../../settings';
import { VaultFolderSuggest } from '../components/vaultFolderSuggest';
import { t } from '../../../i18n';


export function renderNamingTemplatesTab(
	container: HTMLElement,
	ctx: SettingsCtx,
	rerender: () => void
) {
	const { plugin, app } = ctx;

	// ======================
	// Naming pattern
	// ======================
	container.createEl('h3', { text: t('settings.naming.header') });

	const namingInputWrap = container.createDiv();
	namingInputWrap.style.marginTop = '6px';
	namingInputWrap.style.marginBottom = '8px';

	const namingInput = namingInputWrap.createEl('input', { type: 'text' });
	namingInput.style.width = '100%';
	namingInput.value = plugin.settings.namingPattern;

	namingInput.oninput = async () => {
		plugin.settings.namingPattern = namingInput.value;
		await plugin.saveSettings();
	};

	// Reset button
	const namingResetRow = container.createDiv();
	namingResetRow.style.display = 'flex';
	namingResetRow.style.justifyContent = 'flex-end';
	namingResetRow.style.marginBottom = '20px';

	const namingResetBtn = namingResetRow.createEl('button', { text: t('settings.naming.reset') });
	namingResetBtn.onclick = async () => {
		plugin.settings.namingPattern = DEFAULT_NAMING_PATTERN;
		await plugin.saveSettings();
		rerender();
	};

	// ======================
	// Available Variables (Separate Header)
	// ======================
	container.createEl('h3', { text: t('settings.naming.varsHeader') });

	const varsWrap = container.createDiv({ cls: 'setting-item-description' });
	varsWrap.style.marginTop = '6px';
	varsWrap.style.marginBottom = '24px';
	varsWrap.appendChild(renderVarsList(AVAILABLE_VARS));

	// ======================
	// Storage location
	// ======================
	const storageSetting = new Setting(container)
		.setName(t('settings.naming.storageLocation'))
		.addDropdown((d) =>
			d
				.addOption('same-folder', t('settings.naming.storageLocation.sameFolder'))
				.addOption('original-parent-folder', t('settings.naming.storageLocation.originalParentFolder'))
				.addOption('vault-root', t('settings.naming.storageLocation.vaultRoot'))
				.addOption('custom-folder', t('settings.naming.storageLocation.customFolder'))
				.addOption('active-file-folder', t('settings.naming.storageLocation.activeFileFolder'))
				.addOption('active-parent-folder', t('settings.naming.storageLocation.activeParentFolder'))
				.setValue(plugin.settings.storageLocation)
				.onChange(async (v) => {
					plugin.settings.storageLocation = v as any;
					await plugin.saveSettings();
					rerender(); // Полный ререндер для обновления описания и поля custom path
				})
		);

	// Динамическое описание выбранной опции
	const descKey = `settings.naming.storageLocationDesc.${plugin.settings.storageLocation}`;
	storageSetting.setDesc(t(descKey));

	// Поле для Custom Folder появляется только при выборе соответствующей опции
	if (plugin.settings.storageLocation === 'custom-folder') {
		const s = new Setting(container).setName(t('settings.naming.customFolderPath'));
		s.addText((tField) => {
			tField.setPlaceholder(t('settings.naming.customFolderPlaceholder'));
			tField.setValue(plugin.settings.customStoragePath);
			new VaultFolderSuggest(app, tField.inputEl);
			tField.onChange(async (v) => {
				plugin.settings.customStoragePath = v;
				await plugin.saveSettings();
			});
		});
	}

	// ======================
	// Template
	// ======================
	container.createEl('h3', { text: t('settings.template.header'), attr: { style: 'margin-top: 24px;' } });

	new Setting(container)
		.setName(t('settings.template.engine'))
		.addDropdown((d) =>
			d
				.addOption('builtin', t('settings.template.engine.builtin'))
				.addOption('core-templates', t('settings.template.engine.core'))
				.addOption('templater', t('settings.template.engine.templater'))
				.setValue(plugin.settings.templateEngine as any)
				.onChange(async (v) => {
					plugin.settings.templateEngine = v as any;
					await plugin.saveSettings();
					rerender();
				})
		);

	// Engine-specific UI
	if (plugin.settings.templateEngine === 'templater') {
		new Setting(container)
			.setName(t('settings.template.templaterPath'))
			.addText((tField) =>
				tField.setValue(plugin.settings.templaterPath).onChange(async (v) => {
					plugin.settings.templaterPath = v;
					await plugin.saveSettings();
				})
			);
	}

	// Built-in template UI
	if (plugin.settings.templateEngine === 'builtin') {
		new Setting(container)
			.setName(t('settings.template.builtinTemplate'))
			.addButton((b) =>
				b.setButtonText(t('settings.template.resetDefault')).onClick(async () => {
					plugin.settings.templateContent = DEFAULT_TEMPLATE;
					await plugin.saveSettings();
					rerender();
				})
			);

		const ta = container.createEl('textarea');
		ta.style.width = '100%';
		ta.style.height = '220px';
		ta.style.marginTop = '10px';
		ta.style.fontFamily = 'monospace';
		ta.value = plugin.settings.templateContent;
		ta.onchange = async () => {
			plugin.settings.templateContent = ta.value;
			await plugin.saveSettings();
		};
	}

	// About / Overlay header
	new Setting(container)
		.setName(t('settings.about.header'))
		.addText((tField) =>
			tField.setValue(plugin.settings.aboutSectionHeader).onChange(async (v) => {
				plugin.settings.aboutSectionHeader = v;
				await plugin.saveSettings();
			})
		);
}

function renderVarsList(
	vars: Array<{ name: string; descKey: string }>
): DocumentFragment {
	const frag = document.createDocumentFragment();
	const ul = document.createElement('ul');
	ul.style.margin = '0';
	ul.style.paddingLeft = '18px';

	for (const v of vars) {
		const li = document.createElement('li');
		const code = document.createElement('code');
		code.textContent = v.name;

		li.appendChild(code);
		li.appendChild(document.createTextNode(` — ${t(v.descKey)}`));
		ul.appendChild(li);
	}

	frag.appendChild(ul);
	return frag;
}
