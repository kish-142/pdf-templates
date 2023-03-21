const colors = {
  primary: {
    DEFAULT: "#663399",
  },
  grey: "#767676",
  white: "#FFFFFF",
};

module.exports = {
  content: ["./dist/**/*.html"],
  theme: {
    extend: {},
    colors: {
      primary: colors.primary,
      grey: colors.grey,
      white: colors.white,
    },
  },
  plugins: [],
};
