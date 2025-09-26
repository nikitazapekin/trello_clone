export const ERROR_MESSAGE_TEST = {
  DESCRIPTION: "getErrorMessage function",
  IT: {
    HANDLES_ERROR_INSTANCE: "should return error message when Error instance is passed",
    HANDLES_STRING: "should return the string when string is passed",
    HANDLES_UNKNOWN_TYPES: "should return default message for unknown error types",
  },
  TEST_DATA: {
    ERROR_INSTANCE: new Error("Test error message"),
    ERROR_STRING: "Simple error string",
    ERROR_OBJECT: { some: "object" },
    ERROR_NUMBER: 123,
  },
  EXPECTED_RESULTS: {
    ERROR_MESSAGE: "Test error message",
    STRING_MESSAGE: "Simple error string",
    DEFAULT_MESSAGE: "Unknown error occurred",
  },
};
