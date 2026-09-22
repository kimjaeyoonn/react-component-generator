import { describe, it, expect } from 'vitest';
import { validatePromptLength, MAX_PROMPT_LENGTH } from './validatePrompt';

describe('validatePromptLength', () => {
  it('500자 이하면 유효하다', () => {
    const result = validatePromptLength('a'.repeat(500));
    expect(result.valid).toBe(true);
  });

  it('500자를 초과하면 유효하지 않다', () => {
    const result = validatePromptLength('a'.repeat(501));
    expect(result.valid).toBe(false);
  });

  it('500자를 초과하면 현재 길이를 포함한 에러 메시지를 반환한다', () => {
    const result = validatePromptLength('a'.repeat(501));
    expect(result.error).toContain('501');
  });

  it('빈 문자열은 유효하다', () => {
    const result = validatePromptLength('');
    expect(result.valid).toBe(true);
  });

  it('제한 상수는 500이다', () => {
    expect(MAX_PROMPT_LENGTH).toBe(500);
  });
});
