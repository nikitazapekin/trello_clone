export const NOT_FOUND_TEST = {
  DESCRIPTION: "NotFound Component",
  IT: {
    RENDERS_TITLE_AND_MESSAGE: "renders page title and message",
    RENDERS_NAVIGATION_BUTTON: "renders navigation button with correct text",
    RENDERS_BACKGROUND_IMAGE: "renders background image",
    MATCHES_SNAPSHOT: "matches basic structure snapshot",
  },
  CONSTANTS: {
    TEXT: {
      PAGE_TITLE: "Page Not Found",
      PAGE_MESSAGE: "The page you have reached does not exist",
    },
    IMAGE: {
      MOCK_SRC: "test-image.webp",
    },
    BUTTON: {
      BACK_TO_HOMEPAGE: "Home",
    },
  },
};
