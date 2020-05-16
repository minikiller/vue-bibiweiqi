var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  resolve: {
    extensions: [".js", ".vue"],
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.vue?$/,
        exclude: /(node_modules)/,
        use: "vue-loader",
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  devServer: {
    historyApiFallback: true,
    host: "0.0.0.0",
    port: 8080,
  },
  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: "http://192.168.1.34:5000",
      socketUrl: "https://192.168.1.34:3000"
    }),
  },
};
