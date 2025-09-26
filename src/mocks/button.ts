export const BUTTON_TEST = {
  DESCRIPTION: "Button Component",
  IT: {
    RENDERS_CORRECT_TEXT: "renders button with correct text",
    CALLS_HANDLER: "calls handler when clicked",
    APPLIES_FULL_WIDTH: "applies full width styles when isFullWidth is true",
    MATCHES_SNAPSHOT: "matches snapshot",
  },
  CONSTANTS: {
    DEFAULT_PROPS: {
      text: "Test Button",
      handler: typeof jest !== "undefined" ? jest.fn() : () => {},
      isActive: false,
      isFullWidth: false,
    },
    STYLES: {
      FULL_WIDTH: "width: 100%",
    },
  },
};
