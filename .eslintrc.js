module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: ["plugin:vue/recommended", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  plugins: ["vue"], // enable vue plugin
  parserOptions: {
    parser: "babel-eslint"
  },
  settings: {
    "import/resolver": "webpack"
  }
};
