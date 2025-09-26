/* export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
} as const;
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  WEATHER_CACHE: (url: string) => `weather_cache_${url}`,
} as const;
