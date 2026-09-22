import type { GeneratedComponent } from '../types';

export function deserializeComponents(raw: unknown): GeneratedComponent[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      id: typeof item.id === 'string' ? item.id : '',
      prompt: typeof item.prompt === 'string' ? item.prompt : '',
      code: typeof item.code === 'string' ? item.code : '',
      createdAt: new Date(item.createdAt as string),
    }))
    .filter((component) => component.id !== '' && !Number.isNaN(component.createdAt.getTime()));
}
