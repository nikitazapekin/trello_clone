import { css } from "styled-components";

export const flex = (
  justifyContent = "flex-start",
  alignItems = "stretch",
  flexDirection = "row",
  columnGap = "0px",
  rowGap = "0px"
) => css`
  display: flex;
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-direction: ${flexDirection};
  column-gap: ${columnGap};
  row-gap: ${rowGap};
`;

export const grid = (
  justifyContent = "start",
  alignItems = "stretch",
  columns = "1fr",
  rows = "auto",
  alignContent = "start",
  justifyItems = "stretch"
) => css`
  display: grid;
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  grid-template-columns: ${columns};
  grid-template-rows: ${rows};
  align-content: ${alignContent};
  justify-items: ${justifyItems};
`;
