export const MAX_PROMPT_HISTORY = 20;

export function addToHistory(history: string[], prompt: string): string[] {
  const trimmed = prompt.trim();
  if (!trimmed) return history;

  const withoutDuplicate = history.filter((item) => item !== trimmed);
  return [trimmed, ...withoutDuplicate].slice(0, MAX_PROMPT_HISTORY);
}
