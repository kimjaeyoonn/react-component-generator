import { describe, it, expect } from 'vitest';
import { isProvider } from './provider';

describe('isProvider', () => {
  it('anthropic과 google은 유효한 Provider다', () => {
    expect(isProvider('anthropic')).toBe(true);
    expect(isProvider('google')).toBe(true);
  });

  it('그 외 문자열, undefined, 객체 등은 유효하지 않다', () => {
    expect(isProvider('openai')).toBe(false);
    expect(isProvider(undefined)).toBe(false);
    expect(isProvider(null)).toBe(false);
    expect(isProvider(42)).toBe(false);
    expect(isProvider({})).toBe(false);
  });
});
