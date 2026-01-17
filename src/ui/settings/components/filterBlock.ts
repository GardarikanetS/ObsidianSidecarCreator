import { Setting } from 'obsidian';
import type { ListMode } from '../../../settings';
import { renderPatternExamples } from './patternExamples';
import { t } from '../../../i18n';

export type FilterBlockModel = {
	enableCanvas: { get: () => boolean; set: (v: boolean) => void; };
	enableBases: { get: () => boolean; set: (v: boolean) => void; };
	listMode: { get: () => ListMode; set: (v: ListMode) => void; };
	patterns: { get: () => string; set: (v: string) => void; };
};

export async function renderFilterBlock(
	container: HTMLElement,
	model: FilterBlockModel,
	save: () => Promise<void>
) {
	// 1. Filter Mode
	new Setting(container)
		.setName(t('settings.filters.filterMode'))
		.addDropdown((d) =>
			d
				.addOption('blacklist', t('settings.filters.mode.blacklist'))
				.addOption('whitelist', t('settings.filters.mode.whitelist'))
				.setValue(model.listMode.get())
				.onChange(async (v) => {
					model.listMode.set(v as ListMode);
					await save();
				})
		)
		.settingEl.style.borderBottom = 'none';

	// 2. Examples
	renderPatternExamples(container);

	// 3. Textarea
	const ta = container.createEl('textarea');
	ta.style.width = '100%';
	ta.style.height = '140px';
	ta.style.marginTop = '10px';
	ta.style.marginBottom = '20px';
	ta.style.fontFamily = 'monospace';
	ta.value = model.patterns.get();
	ta.onchange = async () => {
		model.patterns.set(ta.value);
		await save();
	};

	// 4. Canvas Toggle
	new Setting(container)
		.setName(t('settings.filters.enableCanvas'))
		.addToggle((t) =>
			t.setValue(model.enableCanvas.get()).onChange(async (v) => {
				model.enableCanvas.set(v);
				await save();
			})
		)
		.settingEl.style.borderBottom = 'none';

	// 5. Bases Toggle
	new Setting(container)
		.setName(t('settings.filters.enableBases'))
		.addToggle((t) =>
			t.setValue(model.enableBases.get()).onChange(async (v) => {
				model.enableBases.set(v);
				await save();
			})
		)
		.settingEl.style.borderBottom = 'none';
}
