import { expect } from "@jest/globals";
import { FORECAST_ITEM_TEST } from "@mocks";

import { isForecastItem } from "./isForecastItem";

const { DESCRIPTION, IT, TEST_DATA, EXPECTED_RESULTS } = FORECAST_ITEM_TEST;
const {
  VALID_ITEM,
  NULL_CHECK,
  UNDEFINED_CHECK,
  PRIMITIVE_CHECK,
  INVALID_TEMP_CHECK,
  MINIMAL_ITEM_CHECK,
} = IT;
const { VALID_ITEM: validItem, INVALID_ITEM, MINIMAL_ITEM, PRIMITIVES } = TEST_DATA;
const { TRUE, FALSE } = EXPECTED_RESULTS;

describe(`${DESCRIPTION}`, () => {
  it(`${VALID_ITEM}`, () => {
    expect(isForecastItem(validItem)).toBe(TRUE);
  });

  it(`${NULL_CHECK}`, () => {
    expect(isForecastItem(null)).toBe(FALSE);
  });

  it(`${UNDEFINED_CHECK}`, () => {
    expect(isForecastItem(undefined)).toBe(FALSE);
  });

  it(`${PRIMITIVE_CHECK}`, () => {
    expect(isForecastItem(PRIMITIVES.NUMBER)).toBe(FALSE);
    expect(isForecastItem(PRIMITIVES.STRING)).toBe(FALSE);
    expect(isForecastItem(PRIMITIVES.BOOLEAN)).toBe(FALSE);
  });

  it(`${INVALID_TEMP_CHECK}`, () => {
    expect(isForecastItem(INVALID_ITEM)).toBe(FALSE);
  });

  it(`${MINIMAL_ITEM_CHECK}`, () => {
    expect(isForecastItem(MINIMAL_ITEM)).toBe(TRUE);
  });
});
