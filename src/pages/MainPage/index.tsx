import { useEffect } from "react";
import { useDispatch } from "react-redux";
 
import { ERROR_CONSTANTS } from "@constants/errors";
import WeatherAppError from "@errors/weatherAppError";
import { GlobalStyle, PageWrapper, Reset, WrapperContainer } from "@styles";
import { getUserLocation } from "@utils/helpers";

import { fetchCurrentCityRequest } from "@store/actions/currentCity";
import { setCoordinats, setGeolocationDenied } from "@store/actions/currentCoordinats";
import { fetchWeatherByCoordsRequest } from "@store/actions/currentWeather";
import { fetchHourlyWeatherByCoordsRequest } from "@store/actions/weather";

const WeatherPage = () => {
  const { LOCATION_ERROR } = ERROR_CONSTANTS;
  const { TITLE, CANNOT_GET_LOCATION } = LOCATION_ERROR;
  const dispatch = useDispatch();

  useEffect(() => {
    async function handleLocation() {
      try {
        const coords = await getUserLocation();

        dispatch(
          setCoordinats({
            latitude: coords.latitude,
            longitude: coords.longitude,
            isGeolocationDenied: false,
          })
        );
        dispatch(
          fetchWeatherByCoordsRequest({ latitude: coords.latitude, longitude: coords.longitude })
        );
        dispatch(
          fetchHourlyWeatherByCoordsRequest({
            latitude: coords.latitude,
            longitude: coords.longitude,
          })
        );

        dispatch(
          fetchCurrentCityRequest({ latitude: coords.latitude, longitude: coords.longitude })
        );
      } catch {
        dispatch(setGeolocationDenied());
      }
    }

    handleLocation().catch(() => {
      throw new WeatherAppError(TITLE, CANNOT_GET_LOCATION);
    });
  }, [dispatch, CANNOT_GET_LOCATION, TITLE]);

  return (
    <PageWrapper>
      <WrapperContainer>
        <GlobalStyle />
        <Reset />
     
      </WrapperContainer>
    </PageWrapper>
  );
};

export default WeatherPage;
