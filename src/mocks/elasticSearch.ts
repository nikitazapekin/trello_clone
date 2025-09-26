export const ELASTIC_SEARCH_MOCKS = {
  DISPATCH: (typeof jest !== "undefined" ? jest.fn() : () => {}) as jest.Mock,
  SUGGESTIONS: {
    data: [
      {
        name: "Moscow",
        state: "Moscow",
        country: "Russia",
        lat: 55.7558,
        lon: 37.6176,
      },
    ],
    coordinats: { latitude: 55.7558, longitude: 37.6176 },
    loading: false,
  },
  CITY: {
    name: "Moscow",
    state: "Moscow",
    country: "Russia",
    lat: 55.7558,
    lon: 37.6176,
  },
  FORMATTED_CITY_NAME: "Moscow, Moscow, Russia",
};
