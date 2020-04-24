const path = require("path");

module.exports = {
  entry: "./src/manager.ts",
  devtool: "inline-source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  target: "node",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "output.js",
    path: path.resolve(__dirname, "dist"),
  },
};
