import { days, ERROR_CONSTANTS, FIRST_DAY_OF_MONTH, LAST_DAY_OF_MONTH, months } from "@constants";
import WeatherAppError from "@errors/weatherAppError";
import type { TimeAndDate } from "@types/timeAndDateTypes";

export const getCurrentTime = (): TimeAndDate => {
  const {
    TITLE,
    DATE_FORMAT_ERROR,
    DATE_IS_NOT_DEFINRD_ERROR,
    INVALID_DATE_ERROR,
    INVALID_DATE_INDEX_ERROR,
    INVALID_MONTH_INDEX_ERROR,
  } = ERROR_CONSTANTS.DATE_ERRORS;

  try {
    const currentTime = new Date();

    if (isNaN(currentTime.getTime())) {
      throw new WeatherAppError(TITLE, DATE_FORMAT_ERROR);
    }

    const timeString = currentTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (!days || !months) {
      throw new WeatherAppError(TITLE, DATE_IS_NOT_DEFINRD_ERROR);
    }

    const dayIndex = currentTime.getDay();
    const monthIndex = currentTime.getMonth();

    if (dayIndex < 0 || dayIndex >= days.length || !days[dayIndex]) {
      throw new WeatherAppError(TITLE, INVALID_DATE_INDEX_ERROR);
    }

    if (monthIndex < 0 || monthIndex >= months.length || !months[monthIndex]) {
      throw new WeatherAppError(TITLE, INVALID_MONTH_INDEX_ERROR);
    }

    const dayName = days[dayIndex];
    const day = currentTime.getDate();
    const month = months[monthIndex];
    const year = currentTime.getFullYear();

    if (day < FIRST_DAY_OF_MONTH || day > LAST_DAY_OF_MONTH) {
      throw new WeatherAppError(TITLE, INVALID_DATE_ERROR);
    }

    const dateString = `${dayName}, ${day} ${month} ${year}`;

    if (!timeString || !dateString) {
      throw new WeatherAppError(TITLE, INVALID_DATE_INDEX_ERROR);
    }

    return { timeString, dateString };
  } catch (error) {
    return {
      timeString: "",
      dateString: "",
      error: error,
    };
  }
};
