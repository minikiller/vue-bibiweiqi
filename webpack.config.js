var HtmlWebpackPlugin = require("html-webpack-plugin");

const NODE_API_ENV = process.env.NODE_API_ENV || "https://localhost:5000";
const NODE_SOCKET_ENV = process.env.NODE_SOCKET_ENV || "https://localhost:3000";

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
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
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
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]",
          publicPath: "assets/",
        },
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
    disableHostCheck: true,
  },
  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: NODE_API_ENV,
      socketUrl: NODE_SOCKET_ENV,
    }),
  },
};
