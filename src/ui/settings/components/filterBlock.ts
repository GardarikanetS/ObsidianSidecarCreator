import { Setting } from 'obsidian';
import type { ListMode } from '../../../settings';
import { renderPatternExamples } from './patternExamples';

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
	// 1. Filter Mode (перенесли наверх, как на скрине)
	new Setting(container)
		.setName('Filter mode')
		.addDropdown((d) =>
			d
				.addOption('blacklist', 'Blacklist')
				.addOption('whitelist', 'Whitelist')
				.setValue(model.listMode.get())
				.onChange(async (v) => {
					model.listMode.set(v as ListMode);
					await save();
				})
		)
		.settingEl.style.borderBottom = 'none'; // <-- Убираем линию

	// 2. Examples (вставляем сюда)
	renderPatternExamples(container);

	// 3. Textarea
	const ta = container.createEl('textarea');
	ta.style.width = '100%';
	ta.style.height = '140px';
	ta.style.marginTop = '10px';
	ta.style.marginBottom = '20px'; // Отступ до следующих чекбоксов
	ta.style.fontFamily = 'monospace';
	ta.value = model.patterns.get();
	ta.onchange = async () => {
		model.patterns.set(ta.value);
		await save();
	};

	// 4. Canvas Toggle
	new Setting(container)
		.setName('Enable sidecar for Canvas files (.canvas)')
		.addToggle((t) =>
			t.setValue(model.enableCanvas.get()).onChange(async (v) => {
				model.enableCanvas.set(v);
				await save();
			})
		)
		.settingEl.style.borderBottom = 'none'; // <-- Убираем линию

	// 5. Bases Toggle
	new Setting(container)
		.setName('Enable sidecar for Bases files (.base)')
		.addToggle((t) =>
			t.setValue(model.enableBases.get()).onChange(async (v) => {
				model.enableBases.set(v);
				await save();
			})
		)
		.settingEl.style.borderBottom = 'none'; // <-- Убираем линию (последний в блоке)
}
