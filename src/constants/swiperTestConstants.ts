import { TimeOfWeather } from "./weatherConstants";

export const SWIPER_TEST = {
  DESCRIPTION: "Swiper Component",
  IT: {
    RENDERS_SPINNER: "renders Spinner when no weatherElements",
    RENDERS_SWIPER_ITEMS: "renders SwiperItems with correct data",
  },
  CONSTANTS: {
    TEST_IDS: {
      SPINNER: "spinner",
      SWIPER_ITEM: "swiper-item",
    },
    TIME_OF_WEATHER: {
      DAILY: TimeOfWeather.DAILY,
    },
  },
};
