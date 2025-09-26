import type { ForecastItem } from "@types/apiTypes";

export function isForecastItem(item: unknown): item is ForecastItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "dt_txt" in item &&
    "main" in item &&
    typeof (item as ForecastItem).main.temp === "number"
  );
}
