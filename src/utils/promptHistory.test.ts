import { describe, it, expect } from 'vitest';
import { addToHistory, MAX_PROMPT_HISTORY } from './promptHistory';

describe('addToHistory', () => {
  it('새 프롬프트를 맨 앞에 추가한다', () => {
    expect(addToHistory([], '버튼 만들어줘')).toEqual(['버튼 만들어줘']);
    expect(addToHistory(['이전 프롬프트'], '새 프롬프트')).toEqual(['새 프롬프트', '이전 프롬프트']);
  });

  it('이미 있는 프롬프트를 다시 추가하면 맨 앞으로 이동하고 중복되지 않는다', () => {
    const history = ['A', 'B', 'C'];
    expect(addToHistory(history, 'B')).toEqual(['B', 'A', 'C']);
  });

  it('앞뒤 공백은 제거하고 저장한다', () => {
    expect(addToHistory([], '  버튼 만들어줘  ')).toEqual(['버튼 만들어줘']);
  });

  it('빈 문자열은 추가하지 않는다', () => {
    expect(addToHistory(['A'], '   ')).toEqual(['A']);
  });

  it('최대 개수를 넘으면 가장 오래된 항목을 제거한다', () => {
    const history = Array.from({ length: MAX_PROMPT_HISTORY }, (_, i) => `prompt-${i}`);
    const result = addToHistory(history, 'new-prompt');

    expect(result).toHaveLength(MAX_PROMPT_HISTORY);
    expect(result[0]).toBe('new-prompt');
    expect(result).not.toContain(`prompt-${MAX_PROMPT_HISTORY - 1}`);
  });
});
