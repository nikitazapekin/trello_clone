export interface CachedResponse {
  timestamp: number;
  data: unknown;
}

export type WeatherCacheKey = `weather_cache_${string}`;
