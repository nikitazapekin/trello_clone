export const FORMAT_TIME_TEST = {
  DESCRIPTION: "formatTime function",
  IT: {
    FORMATS_RU_CORRECTLY: "should format time correctly ru",
    FORMATS_EN_CORRECTLY: "should format time correctly en",
    HANDLES_INVALID_DATE: "should return empty string for invalid date",
    USES_24H_FORMAT: "should use 24-hour format",
    HANDLES_MIDNIGHT: "should handle midnight correctly",
  },
  TEST_DATA: {
    DATE: "2025-05-15T14:30:00",
    INVALID_DATE: "invalid-date-string",
    PM_DATE: "2025-05-15T22:15:00",
    AM_DATE: "2025-05-15T08:45:00",
    MIDNIGHT_DATE: "2025-05-15T00:00:00",
  },
  LOCALES: {
    RU: "ru-RU",
    EN: "en-US",
  },
  EXPECTED: {
    TIME: "14:30",
    EMPTY: "",
    PM_TIME: "22:15",
    AM_TIME: "08:45",
    MIDNIGHT_TIME: "00:00",
  },
};
