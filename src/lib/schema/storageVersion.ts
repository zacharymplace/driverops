export const DRIVEROPS_STORAGE_VERSION = 1;

export type VersionedPayload<T> = {
  version: number;
  data: T;
};

export function createVersionedPayload<T>(data: T): VersionedPayload<T> {
  return {
    version: DRIVEROPS_STORAGE_VERSION,
    data,
  };
}

export function readVersionedPayload<T>({
  raw,
  fallback,
}: {
  raw: string | null;
  fallback: T;
}): T {
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw) as Partial<VersionedPayload<T>>;

    if (parsed.version === DRIVEROPS_STORAGE_VERSION && "data" in parsed) {
      return parsed.data as T;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
