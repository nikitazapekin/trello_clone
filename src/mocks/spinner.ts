export const SPINNER_TEST = {
  DESCRIPTION: "Spinner Component",
  IT: {
    RENDERS_CORRECTLY: "renders spinner with correct test id",
    APPLIES_POSITION_STYLE: "applies correct position style from props",
    HAS_DEFAULT_STYLES: "has correct default styles",
    MATCHES_SNAPSHOT: "matches snapshot",
  },
  CONSTANTS: {
    TEST_IDS: {
      SPINNER: "spinner",
    },
    POSITIONS: {
      ABSOLUTE: "absolute",
      RELATIVE: "relative",
    },
    STYLES: {
      WIDTH: "30px",
      HEIGHT: "30px",
    },
  },
};
