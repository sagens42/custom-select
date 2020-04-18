module.exports = {
  verbose: true,
  setupFiles: [
    "./src/__mocks__/browserSetup.js"
  ],
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "identity-obj-proxy"
  },
  moduleFileExtensions: [
    "js",
    "html"
  ],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.html$": "html-loader-jest"
  }
};
