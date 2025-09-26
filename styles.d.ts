import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    container: number;
    deviceHeight: string;
    colors: {
      black: string;
      blue: string;
      gray: string;
      white: string;
    };
    fontFamilies: {
      primary: string;
      secondary: string;
    };
    fontSizes: {
      xl: string;
      lg: string;
      md: string;
      sm: string;
      xs: string;
      xxs: string;
    };
    fontWeights: {
      regular: number;
    };
    media: {
      xxl: number;
      xl: number;
      lg: number;
      md: number;
      xh: number;
      sm: number;
    };
    zIndexes: {
      xm: number;
      x: number;
      xs: number;
      sm: number;
      md: number;
    };
    spaces: {
      x: number;
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      g: number;
      h: number;
      xh: number;
      eh: number;
    };
    swiper: {
      item_gap: number;
      margin_base: number;
      vw_ratio: number;
      scroll_snap_type: string;
      scroll_snap_align: string;
      flex_basis: string;
      min_width: string;
      container: number;
    };
  }
}
