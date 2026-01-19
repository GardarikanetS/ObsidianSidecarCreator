import type { App, TFile } from 'obsidian';
import type { SidecarCreatorSettings } from '../settings';
import { PathResolver } from './pathResolver';
import { TemplateManager } from './templateManager';
import { EditorIntegrator } from './editorIntegrator';

export class SidecarService {
	private pathResolver: PathResolver;
	private templateManager: TemplateManager;
	private editorIntegrator: EditorIntegrator;

	constructor(private app: App, private getSettings: () => SidecarCreatorSettings) {
		// Передаем геттер
		this.pathResolver = new PathResolver(app, getSettings);

		// Для остальных сервисов пока передаем текущее значение,
		// но лучше их тоже отрефакторить на использование геттера в будущем
		this.templateManager = new TemplateManager(getSettings());
		this.editorIntegrator = new EditorIntegrator(app, getSettings());
	}

	async ensureSidecarFor(original: TFile): Promise<TFile | null> {
		// 1. Resolve path
		const sidecarPath = this.pathResolver.resolvePath(original);

		// 2. Check collision
		const existing = this.app.vault.getAbstractFileByPath(sidecarPath);

		if (existing) {
			// TODO: Implement logic based on settings.conflictResolution
			// 'sync' | 'increment' | 'manual'
			return null;
		}

		// 3. Create folder
		await this.ensureFolderExists(sidecarPath);

		// 4. Generate content
		const content = await this.templateManager.generateContent(original);

		// 5. Create file
		const created = await this.app.vault.create(sidecarPath, content);

		// 6. Automation (Editor)
		// Если включена автозамена или вставка - зовем editorIntegrator
		// TODO: Connect automation hooks

		return created;
	}

	private async ensureFolderExists(filePath: string) {
		const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));
		if (!folderPath) return;

		const folder = this.app.vault.getAbstractFileByPath(folderPath);
		if (!folder) {
			await this.app.vault.createFolder(folderPath);
		}
	}

	public async onDeleteOriginal(original: TFile) {
		// TODO: Implement settings.deleteBehavior logic
		// 'delete' | 'mark' | 'ask'
	}
}
