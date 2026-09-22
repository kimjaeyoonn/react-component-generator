export const MAX_PROMPT_LENGTH = 500;

export interface PromptValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePromptLength(prompt: string): PromptValidationResult {
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      error: `프롬프트는 ${MAX_PROMPT_LENGTH}자를 초과할 수 없습니다. (현재 ${prompt.length}자)`,
    };
  }
  return { valid: true };
}
