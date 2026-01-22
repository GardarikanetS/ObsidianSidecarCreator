import type { TFile } from 'obsidian';
import { moment } from 'obsidian';
import { AVAILABLE_VARS } from '../settings';

export type TemplateVariables = Record<string, string>;

export function buildTemplateVariables(original: TFile): TemplateVariables {
	return {
		'{{originalName}}': original.basename,
		'{{originalExt}}': original.extension,
		'{{date}}': moment().format('YYYY-MM-DD'),
	};
}

export function applyTemplateVariables(template: string, variables: TemplateVariables): string {
	let result = template;
	for (const variable of AVAILABLE_VARS) {
		const value = variables[variable.name] ?? '';
		result = result.replaceAll(variable.name, value);
	}
	return result;
}
