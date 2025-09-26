import { all, spawn } from "redux-saga/effects";

import { CalendarEvents } from "./calendarEvents";
import { CurrentCity } from "./currentCity";
import { CurrentWeather } from "./currentWeather";
import { FetchCities } from "./elasticSearch";
import { Weather } from "./weather";

export default function* rootSaga() {
  yield all([
    spawn(CurrentWeather),
    spawn(CalendarEvents),
    spawn(Weather),
    spawn(FetchCities),
    spawn(CurrentCity),
  ]);
}
