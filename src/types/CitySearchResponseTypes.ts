export interface CitySearchResult {
  name: string;
  local_names?: {
    [key: string]: string;
  };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CitySearchError {
  cod: string;
  message: string;
}

export type OpenWeatherGeoResponse = CitySearchResult[] | CitySearchError;
