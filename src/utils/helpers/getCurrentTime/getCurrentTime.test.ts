import { expect } from "@jest/globals";
import { days, GET_CURRENT_TIME_TEST, months } from "@mocks";

import { getCurrentTime } from "./getCurrentTime";

const { DESCRIPTION, IT, EXPECTATIONS } = GET_CURRENT_TIME_TEST;
const { RETURNS_CORRECT_DATE_FORMAT, RETURNS_EXPECTED_PROPERTIES } = IT;
const { PROPERTIES, TYPES } = EXPECTATIONS;

describe(`${DESCRIPTION}`, () => {
  it(`${RETURNS_CORRECT_DATE_FORMAT}`, () => {
    const currentDate = new Date();
    const { dateString } = getCurrentTime();

    const expectedParts = {
      dayName: days[currentDate.getDay()],
      day: currentDate.getDate(),
      month: months[currentDate.getMonth()],
      year: currentDate.getFullYear(),
    };

    const expectedDateString = `${expectedParts.dayName}, ${expectedParts.day} ${expectedParts.month} ${expectedParts.year}`;

    expect(dateString).toBe(expectedDateString);
  });

  it(`${RETURNS_EXPECTED_PROPERTIES}`, () => {
    const result = getCurrentTime();

    expect(result).toHaveProperty(PROPERTIES.TIME_STRING);
    expect(result).toHaveProperty(PROPERTIES.DATE_STRING);
    expect(typeof result.timeString).toBe(TYPES.STRING);
    expect(typeof result.dateString).toBe(TYPES.STRING);
  });
});
