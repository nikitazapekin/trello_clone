import { expect } from "@jest/globals";
import { FORMAT_TIME_TEST } from "@mocks";

import { formatTime } from "./formatTime";

const { DESCRIPTION, IT, TEST_DATA, LOCALES, EXPECTED } = FORMAT_TIME_TEST;
const {
  FORMATS_RU_CORRECTLY,
  FORMATS_EN_CORRECTLY,
  HANDLES_INVALID_DATE,
  USES_24H_FORMAT,
  HANDLES_MIDNIGHT,
} = IT;
const { DATE, INVALID_DATE, PM_DATE, AM_DATE, MIDNIGHT_DATE } = TEST_DATA;
const { RU, EN } = LOCALES;
const { TIME, EMPTY, PM_TIME, AM_TIME, MIDNIGHT_TIME } = EXPECTED;

describe(`${DESCRIPTION}`, () => {
  it(`${FORMATS_RU_CORRECTLY}`, () => {
    const testDate = new Date(DATE);
    const result = formatTime(testDate.toISOString(), RU);

    expect(result).toBe(TIME);
  });

  it(`${FORMATS_EN_CORRECTLY}`, () => {
    const testDate = new Date(DATE);
    const result = formatTime(testDate.toISOString(), EN);

    expect(result).toBe(TIME);
  });

  it(`${HANDLES_INVALID_DATE}`, () => {
    const result = formatTime(INVALID_DATE);

    expect(result).toBe(EMPTY);
  });

  it(`${USES_24H_FORMAT}`, () => {
    const testDatePM = new Date(PM_DATE);
    const resultPM = formatTime(testDatePM.toISOString());

    expect(resultPM).toBe(PM_TIME);

    const testDateAM = new Date(AM_DATE);
    const resultAM = formatTime(testDateAM.toISOString());

    expect(resultAM).toBe(AM_TIME);
  });

  it(`${HANDLES_MIDNIGHT}`, () => {
    const testDate = new Date(MIDNIGHT_DATE);
    const result = formatTime(testDate.toISOString());

    expect(result).toBe(MIDNIGHT_TIME);
  });
});
