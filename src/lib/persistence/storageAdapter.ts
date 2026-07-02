export type StorageAdapter = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export function getBrowserStorageAdapter(): StorageAdapter | null {
  if (typeof localStorage === "undefined") return null;

  return {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
    removeItem: (key) => localStorage.removeItem(key),
  };
}

export function createMemoryStorageAdapter(): StorageAdapter {
  const store = new Map<string, string>();

  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => {
      store.delete(key);
    },
  };
}
