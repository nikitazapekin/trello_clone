import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UI_CONFIG } from "@constants/utilsConstants";
import type { CitySearchResult } from "@types/CitySearchResponseTypes";

import { fetchCurrentCityRequest } from "@store/actions/currentCity";
import { setCoordinats, setGeolocationDenied } from "@store/actions/currentCoordinats";
import { fetchWeatherByCoordsRequest } from "@store/actions/currentWeather";
import {
  fetchCitiesActive,
  fetchCitiesRequest,
  fetchClearCitiesRequest,
  fetchHasLastSearch,
  fetchSuggestedCityCoordinats,
} from "@store/actions/elasticSearch";
import { fetchWeeklyWeatherByCoordsRequest } from "@store/actions/weather";
import { selectCitiesSuggestions } from "@store/selectors";

export const useElastic = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);
  const dispatch = useDispatch();
  const { coordinats } = useSelector(selectCitiesSuggestions);
  const suggestedCities = useSelector(selectCitiesSuggestions).data as CitySearchResult[];
  const { DELAY } = UI_CONFIG.DEBOUNCE;
  const fetchCities = useCallback(
    (query: string): void => {
      if (query.length < 1) {
        dispatch(fetchClearCitiesRequest());
        dispatch(fetchCitiesActive(false));

        return;
      }

      dispatch(fetchCitiesRequest({ city: query }));
    },
    [dispatch]
  );

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      fetchCities(inputValue);
    }, DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, fetchCities, DELAY]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  }, []);

  const handleSuggestionClick = useCallback(
    (city: CitySearchResult) => () => {
      const cityName = `${city.name}${city.state ? `, ${city.state}` : ""}, ${city.country}`;

      setInputValue(cityName);
      setShowSuggestions(false);
      dispatch(fetchSuggestedCityCoordinats({ latitude: city.lat, longitude: city.lon }));
      dispatch(
        setCoordinats({ latitude: city.lat, longitude: city.lon, isGeolocationDenied: false })
      );

      return cityName;
    },
    [dispatch]
  );

  const formatCityName = useCallback((city: CitySearchResult): string => {
    return `${city.name}${city.state ? `, ${city.state}` : ""}, ${city.country}`;
  }, []);

  const handleSearchCity = useCallback((): void => {
    dispatch(fetchWeeklyWeatherByCoordsRequest(coordinats));
    dispatch(fetchCitiesActive(true));
    dispatch(
      fetchWeatherByCoordsRequest({
        latitude: coordinats.latitude,
        longitude: coordinats.longitude,
      })
    );
    dispatch(
      fetchCurrentCityRequest({
        latitude: coordinats.latitude,
        longitude: coordinats.longitude,
      })
    );
    dispatch(setGeolocationDenied());
    dispatch(fetchHasLastSearch());
    setShowSuggestions(false);
  }, [coordinats, dispatch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === "Enter") {
        handleSearchCity();
      }
    },
    [handleSearchCity]
  );

  return {
    inputValue,
    showSuggestions,
    suggestedCities,
    setShowSuggestions,
    setInputValue,
    handleInputChange,
    handleSuggestionClick,
    formatCityName,
    coordinats,
    handleSearchCity,
    handleKeyDown,
  };
};
