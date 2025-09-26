import { expect } from "@jest/globals";
import { EXTRACT_TIME_TEST } from "@mocks";

import { extractTime } from "./extractHours";

const { DESCRIPTION, IT, TEST_DATA, EXPECTATIONS } = EXTRACT_TIME_TEST;
const { RETURNS_STRING_TYPE } = IT;
const { DATE_STRING } = TEST_DATA;
const { TYPE } = EXPECTATIONS;

describe(`${DESCRIPTION}`, () => {
  it(`${RETURNS_STRING_TYPE}`, () => {
    const result = extractTime(DATE_STRING);

    expect(typeof result).toBe(TYPE);
  });
});
