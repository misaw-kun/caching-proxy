import { startProxy } from "./proxy";
import { CustomCache, setupCache, type CacheEntry } from "./cache";

export function runProxy(proxyPort: number, originUrl: string) {
  const cache = setupCache();
  startProxy(proxyPort, originUrl, cache as CustomCache<string, CacheEntry>);
}
