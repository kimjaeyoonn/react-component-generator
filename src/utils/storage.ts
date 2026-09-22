export function readStorageValue(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function writeStorageValue(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 프라이빗 모드, 용량 초과 등으로 저장에 실패해도 앱 동작에는 영향이 없어야 하므로 무시한다.
  }
}
