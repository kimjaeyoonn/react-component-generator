import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readStorageValue, writeStorageValue } from './storage';

describe('writeStorageValue / readStorageValue', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('저장한 값을 그대로 읽어올 수 있다', () => {
    writeStorageValue('key', { a: 1, b: ['x', 'y'] });
    expect(readStorageValue('key')).toEqual({ a: 1, b: ['x', 'y'] });
  });

  it('키가 없으면 undefined를 반환한다', () => {
    expect(readStorageValue('missing-key')).toBeUndefined();
  });

  it('저장된 값이 손상된 JSON이면 undefined를 반환한다', () => {
    localStorage.setItem('broken', '{not valid json');
    expect(readStorageValue('broken')).toBeUndefined();
  });

  it('localStorage.setItem이 실패해도 에러를 던지지 않는다', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    expect(() => writeStorageValue('key', 'value')).not.toThrow();

    spy.mockRestore();
  });
});
