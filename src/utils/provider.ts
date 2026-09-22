import type { Provider } from '../types';

export function isProvider(value: unknown): value is Provider {
  return value === 'anthropic' || value === 'google';
}
