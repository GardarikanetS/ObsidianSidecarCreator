import { Setting } from 'obsidian';
import type { SettingsCtx } from '../types';
import { DEFAULT_TEMPLATE } from '../../../assets/defaultTemplate';
import { DEFAULT_NAMING_PATTERN, NAMING_VARS, TEMPLATE_VARS } from '../../../settings';
import { VaultFolderSuggest } from '../components/vaultFolderSuggest';

export function renderNamingTemplatesTab(
	container: HTMLElement,
	ctx: SettingsCtx,
	rerender: () => void
) {
	const { plugin, app } = ctx;

	// ======================
	// Naming pattern (Header)
	// ======================
	container.createEl('h3', { text: 'Naming pattern' });

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

	// Reset button BELOW input
	const namingResetRow = container.createDiv();
	namingResetRow.style.display = 'flex';
	namingResetRow.style.justifyContent = 'flex-end';
	namingResetRow.style.marginBottom = '10px';

	const namingResetBtn = namingResetRow.createEl('button', { text: 'Reset' });
	namingResetBtn.onclick = async () => {
		plugin.settings.namingPattern = DEFAULT_NAMING_PATTERN;
		await plugin.saveSettings();
		rerender();
	};

	// Available vars (not hardcoded)
	const namingVarsWrap = container.createDiv({ cls: 'setting-item-description' });
	namingVarsWrap.style.marginTop = '0';
	namingVarsWrap.style.marginBottom = '18px';
	namingVarsWrap.appendChild(renderVarsList('Available vars:', NAMING_VARS));

	// Storage location (как было)
	new Setting(container)
		.setName('Storage location')
		.addDropdown((d) =>
			d
				.addOption('same-folder', 'Same folder')
				.addOption('vault-root', 'Vault root')
				.addOption('custom-folder', 'Custom folder')
				.addOption('active-file-folder', 'Active file folder')
				.setValue(plugin.settings.storageLocation)
				.onChange(async (v) => {
					plugin.settings.storageLocation = v as any;
					await plugin.saveSettings();
					rerender();
				})
		);

	if (plugin.settings.storageLocation === 'custom-folder') {
		const s = new Setting(container).setName('Custom folder path');
		s.addText((t) => {
			t.setPlaceholder('Folder/Subfolder');
			t.setValue(plugin.settings.customStoragePath);
			new VaultFolderSuggest(app, t.inputEl);
			t.onChange(async (v) => {
				plugin.settings.customStoragePath = v;
				await plugin.saveSettings();
			});
		});
	}

	// ==============
	// Template (Header)
	// ==============
	container.createEl('h3', { text: 'Template', attr: { style: 'margin-top: 24px;' } });

	// Template engine with new option
	new Setting(container)
		.setName('Template engine')
		.addDropdown((d) =>
			d
				.addOption('builtin', 'Built-in')
				.addOption('core-templates', 'Native templates')
				.addOption('templater', 'Templater')
				.setValue(plugin.settings.templateEngine as any)
				.onChange(async (v) => {
					plugin.settings.templateEngine = v as any;
					await plugin.saveSettings();
					rerender();
				})
		);

	// Template available vars (not hardcoded)
	const tplVarsWrap = container.createDiv({ cls: 'setting-item-description' });
	tplVarsWrap.style.marginTop = '0';
	tplVarsWrap.style.marginBottom = '12px';
	tplVarsWrap.appendChild(renderVarsList('Template available vars:', TEMPLATE_VARS));

	// Engine-specific UI
	if (plugin.settings.templateEngine === 'templater') {
		new Setting(container)
			.setName('Templater file path')
			.addText((t) =>
				t.setValue(plugin.settings.templaterPath).onChange(async (v) => {
					plugin.settings.templaterPath = v;
					await plugin.saveSettings();
				})
			);
	}

	// Built-in template UI (textarea + reset) only for builtin
	if (plugin.settings.templateEngine === 'builtin') {
		new Setting(container)
			.setName('Built-in template')
			.addButton((b) =>
				b.setButtonText('Reset to default').onClick(async () => {
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

	// About / Overlay header (после Template)
	new Setting(container)
		.setName('About header')
		.addText((t) =>
			t.setValue(plugin.settings.aboutSectionHeader).onChange(async (v) => {
				plugin.settings.aboutSectionHeader = v;
				await plugin.saveSettings();
			})
		);
}

// ---------- helpers ----------
function renderVarsList(
	title: string,
	vars: Array<{ name: string; desc: string }>
): DocumentFragment {
	const frag = document.createDocumentFragment();

	const head = document.createElement('div');
	head.textContent = title;
	head.style.marginBottom = '6px';
	frag.appendChild(head);

	const ul = document.createElement('ul');
	ul.style.margin = '0';
	ul.style.paddingLeft = '18px';

	for (const v of vars) {
		const li = document.createElement('li');

		const code = document.createElement('code');
		code.textContent = v.name;

		li.appendChild(code);
		li.appendChild(document.createTextNode(` — ${v.desc}`));
		ul.appendChild(li);
	}

	frag.appendChild(ul);
	return frag;
}
