export type CacheEntry = {
  data: string;
  headers: Record<string, string>;
  timestamp: number;
};

// custom cache map type for overriding the set function
export class CustomCache<K, V> extends Map<K, V> {
  private maxSize: number;

  constructor(maxSize: number) {
    super();
    this.maxSize = maxSize;
  }

  set(key: K, value: V) {
    if (this.size >= this.maxSize) {
      evictOldestCache(this as CustomCache<string, CacheEntry>);
    }
    return super.set(key, value);
  }
}

export function setupCache(maxSize = 100) {
  const cache = new CustomCache<string, CacheEntry>(maxSize);

  return {
    get: (key: string) => cache.get(key),
    set: (key: string, value: CacheEntry) => {
      if (cache.size >= maxSize) {
        evictOldestCache(cache);
      }
      cache.set(key, value);
    },
  };
}

function evictOldestCache(cache: CustomCache<string, CacheEntry>) {
  const oldestKey = [...cache.keys()][0];
}
