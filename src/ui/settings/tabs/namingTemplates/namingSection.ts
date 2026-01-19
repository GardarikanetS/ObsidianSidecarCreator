import { Setting, Notice } from 'obsidian';
import type { SettingsCtx } from '../../types';
import { DEFAULT_NAMING_PATTERN } from '../../../../settings';
import { VaultFolderSuggest } from '../../components/vaultFolderSuggest';
import { t } from '../../../../i18n';

export function renderNamingSection(
	container: HTMLElement,
	ctx: SettingsCtx,
	rerender: () => void
) {
	const { plugin, app } = ctx;

	// === 1. Naming Pattern ===
	container.createEl('h3', { text: t('settings.naming.header') });

	const patternRow = container.createDiv();
	patternRow.style.display = 'flex';
	patternRow.style.gap = '10px';
	patternRow.style.alignItems = 'center'; // Выравнивание по вертикали
	patternRow.style.marginBottom = '15px';

	const namingInput = patternRow.createEl('input', { type: 'text' });
	namingInput.style.flex = '1';
	namingInput.value = plugin.settings.namingPattern;
	namingInput.oninput = async () => {
		plugin.settings.namingPattern = namingInput.value;
		await plugin.saveSettings();
	};

	const namingResetBtn = patternRow.createEl('button', { text: t('settings.naming.reset') });
	namingResetBtn.onclick = async () => {
		plugin.settings.namingPattern = DEFAULT_NAMING_PATTERN;
		await plugin.saveSettings();
		rerender();
	};

	// === 2. Storage Location ===
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
					rerender();
				})
		);

	const descKey = `settings.naming.storageLocationDesc.${plugin.settings.storageLocation}`;
	const descText = t(descKey);
	if (descText && descText !== descKey) {
		// Рендерим описание отдельным блоком для красоты и контроля
		storageSetting.setDesc(descText);
	}

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

	// === 3. Button to Obsidian Settings ===
	const obsBtnContainer = container.createDiv();
	obsBtnContainer.style.marginTop = '15px';

	const obsBtn = obsBtnContainer.createEl('button', {
		text: t('settings.naming.openObsidianSettings')
	});

	obsBtn.onclick = () => {
		// Robust way to find and open settings tab
		// @ts-ignore
		const setting = app.setting;

		// Попытка найти вкладку по разным ID, так как они могут меняться
		// file-links - стандартный ID, files - возможный вариант
		// @ts-ignore
		let tab = setting.settingTabs.find(t => t.id === 'file');

		if (!tab) {
			// Fallback: ищем по имени (если ID сменился)
			// @ts-ignore
			tab = setting.settingTabs.find(t => t.id === 'file-links' || t.name === 'Files & Links' || t.name === 'Файлы и ссылки');
		}

		if (tab) {
			setting.openTab(tab);
		} else {
			// Если совсем не нашли, просто открываем настройки
			setting.open();
			new Notice('Could not find specific tab, opened general settings.');
		}
	};
}
