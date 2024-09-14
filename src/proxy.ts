import type { CacheEntry } from "./cache";

export function startProxy(
  proxyPort: number,
  originUrl: string,
  cache: Map<string, CacheEntry>
) {
  Bun.serve({
    port: proxyPort,
    async fetch(request) {
      const url = new URL(request.url);
      const targetURL = `${originUrl}${url.pathname}${url.search}`;

      // cache handling
      const cachedResponse = getCachedResponse(cache, targetURL);
      if (cachedResponse) {
        return cachedResponse;
      }

      // fetch the response from the origin
      const res = await fetch(targetURL);
      const body = await res.text();

      // store in cache
      const headers = {
        "content-type": res.headers.get("content-type") || "",
        "cache-control": res.headers.get("cache-control") || "",
      };
      cache.set(targetURL, { data: body, headers, timestamp: Date.now() });

      return new Response(body, {
        status: res.status,
        headers: {
          ...headers,
          "X-Cache": "MISS",
        },
      });
    },
  });
}

function getCachedResponse(cache: Map<string, CacheEntry>, targetURL: string) {
  const cached = cache.get(targetURL);

  if (cached && !isCacheExpired(cached)) {
    console.log("CACHE HIT");

    return new Response(cached.data, {
      status: 200,
      headers: {
        ...cached.headers,
        "X-Cache": "HIT",
      },
    });
  }
  return null;
}

function isCacheExpired(cached: CacheEntry) {
  const CACHE_TTL = 60 * 1000;
  return Date.now() - cached.timestamp > CACHE_TTL;
}
