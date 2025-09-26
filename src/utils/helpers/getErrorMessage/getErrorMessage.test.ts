import { expect } from "@jest/globals";
import { ERROR_MESSAGE_TEST } from "@mocks";

import { getErrorMessage } from "./getErrorMessage";

const { DESCRIPTION, IT, TEST_DATA, EXPECTED_RESULTS } = ERROR_MESSAGE_TEST;
const { HANDLES_ERROR_INSTANCE, HANDLES_STRING, HANDLES_UNKNOWN_TYPES } = IT;
const { ERROR_INSTANCE, ERROR_STRING, ERROR_OBJECT, ERROR_NUMBER } = TEST_DATA;
const { ERROR_MESSAGE, STRING_MESSAGE, DEFAULT_MESSAGE } = EXPECTED_RESULTS;

describe(`${DESCRIPTION}`, () => {
  it(`${HANDLES_ERROR_INSTANCE}`, () => {
    const result = getErrorMessage(ERROR_INSTANCE);

    expect(result).toBe(ERROR_MESSAGE);
  });

  it(`${HANDLES_STRING}`, () => {
    const result = getErrorMessage(ERROR_STRING);

    expect(result).toBe(STRING_MESSAGE);
  });

  it(`${HANDLES_UNKNOWN_TYPES}`, () => {
    expect(getErrorMessage(ERROR_OBJECT)).toBe(DEFAULT_MESSAGE);
    expect(getErrorMessage(ERROR_NUMBER)).toBe(DEFAULT_MESSAGE);
  });
});
