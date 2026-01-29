import type { SettingsCtx } from '../types';
import { renderVaultScanSettings } from './automation/vaultScan';
import { renderSidecarModifySettings } from './automation/sidecarModify';
import { renderEditorIntegratorSettings } from './automation/editorIntegrator';
import { renderDeletionSettings } from './automation/deletion';

export function renderAutomationTab(
	container: HTMLElement,
	ctx: SettingsCtx,
	rerender?: () => void
) {
	// 1. Scan & Import
	renderVaultScanSettings(container, ctx);

	const hr1 = container.createEl('hr');
	hr1.style.marginTop = '20px';
	hr1.style.marginBottom = '20px';

	// 2. Modify & Delete
	renderSidecarModifySettings(container, ctx);

	const hr2 = container.createEl('hr');
	hr2.style.marginTop = '20px';
	hr2.style.marginBottom = '20px';

	// 3. Editor Integration (Swap, Embed, Lines)
	renderEditorIntegratorSettings(container, ctx);

	const hr3 = container.createEl('hr');
	hr3.style.marginTop = '20px';
	hr3.style.marginBottom = '20px';

	// 4. Deletion
	renderDeletionSettings(container, ctx);
}
