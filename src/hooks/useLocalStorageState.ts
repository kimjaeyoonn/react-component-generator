import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { readStorageValue, writeStorageValue } from '../utils/storage';

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  fromStorage: (raw: unknown) => T | undefined = (raw) => raw as T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const raw = readStorageValue(key);
    if (raw === undefined) return initialValue;
    const parsed = fromStorage(raw);
    return parsed !== undefined ? parsed : initialValue;
  });

  useEffect(() => {
    writeStorageValue(key, value);
  }, [key, value]);

  return [value, setValue];
}
