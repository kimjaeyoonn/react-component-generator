import { describe, it, expect } from 'vitest';
import { deserializeComponents } from './componentStorage';

describe('deserializeComponents', () => {
  it('유효한 배열을 GeneratedComponent[]로 변환하고 createdAt을 Date로 복원한다', () => {
    const raw = [
      { id: '1', prompt: '버튼 만들어줘', code: 'render(<button/>)', createdAt: '2026-01-01T00:00:00.000Z' },
    ];

    const result = deserializeComponents(raw);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    expect(result[0].prompt).toBe('버튼 만들어줘');
    expect(result[0].code).toBe('render(<button/>)');
    expect(result[0].createdAt).toBeInstanceOf(Date);
    expect(result[0].createdAt.toISOString()).toBe('2026-01-01T00:00:00.000Z');
  });

  it('배열이 아니면 빈 배열을 반환한다', () => {
    expect(deserializeComponents({ not: 'an array' })).toEqual([]);
    expect(deserializeComponents(undefined)).toEqual([]);
    expect(deserializeComponents(null)).toEqual([]);
  });

  it('id가 없는 항목은 걸러낸다', () => {
    const raw = [{ prompt: 'x', code: 'y', createdAt: '2026-01-01T00:00:00.000Z' }];
    expect(deserializeComponents(raw)).toEqual([]);
  });

  it('createdAt이 유효하지 않은 날짜면 걸러낸다', () => {
    const raw = [{ id: '1', prompt: 'x', code: 'y', createdAt: 'not-a-date' }];
    expect(deserializeComponents(raw)).toEqual([]);
  });

  it('배열 안에 객체가 아닌 값이 섞여 있어도 걸러낸다', () => {
    const raw = [null, 'string', 42, { id: '1', prompt: 'x', code: 'y', createdAt: '2026-01-01T00:00:00.000Z' }];
    expect(deserializeComponents(raw)).toHaveLength(1);
  });
});
