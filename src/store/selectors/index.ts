import type { RootState } from "..";

export const selectCalendarEvents = (state: RootState) => state.calendarReducer;
export const selectCurrentWeather = (state: RootState) => state.currentWeatherReducer;
export const selectCurrentCoordinats = (state: RootState) => state.coordinatsReducer;
export const selectWeather = (state: RootState) => state.weatherReducer;
export const selectCitiesSuggestions = (state: RootState) => state.elasticReducer;
export const selectCurrentCity = (state: RootState) => state.currentCityReducer;
