export const storage = {
  get<T = string>(key: string, fallback?: T): T | undefined {
    const value = localStorage.getItem(key);
    if (value === null) {
      return fallback;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  },
  set(key: string, value: unknown) {
    if (value === undefined) {
      return;
    }
    const raw = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, raw);
  },
  remove(key: string) {
    localStorage.removeItem(key);
  },
};
