import { theme } from "@constants";
import { css } from "styled-components";

export const breakpoints = {
  xxl: theme.media.xxl,
  xl: theme.media.xl,
  lg: theme.media.lg,
  md: theme.media.md,
  xh: theme.media.xh,
  sm: theme.media.sm,
} as const;

type Breakpoint = keyof typeof breakpoints;

export const media = Object.fromEntries(
  Object.entries(breakpoints).map(([name, size]) => [
    name,
    (styles: TemplateStringsArray, ...interpolations: any[]) => css`
      @media (max-width: ${size}px) {
        ${css(styles, ...interpolations)}
      }
    `,
  ])
) as Record<Breakpoint, typeof css>;
