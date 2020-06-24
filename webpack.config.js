var HtmlWebpackPlugin = require("html-webpack-plugin");
/* const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin; */
const NODE_API_ENV = process.env.NODE_API_ENV || "https://localhost:5000";
const NODE_SOCKET_ENV = process.env.NODE_SOCKET_ENV || "https://localhost:3000";
const copyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");
// const utils = require("./utils");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}
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
      /* {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      }, */
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
        test: /\.scss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        exclude: [resolve("src/icons")],
        options: {
          name: "[name].[ext]?[hash]",
          publicPath: "assets/",
        },
      },
      {
        test: /.svg$/,
        loader: "svg-sprite-loader",
        include: [resolve("src/icons")],
        options: {
          symbolId: "icon-[name]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new copyWebpackPlugin({
      patterns: [
        {
          from: __dirname + "/static",
          to: __dirname + "/dist/static",
        },
      ],
    }),
    /* new BundleAnalyzerPlugin({
      analyzerMode: "disabled",
      generateStatsFile: true,
      statsOptions: { source: false },
    }), */
  ],
  devServer: {
    historyApiFallback: true,
    host: "0.0.0.0",
    port: 8080,
    disableHostCheck: true,
  },
  stats: { children: false },
  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: NODE_API_ENV,
      socketUrl: NODE_SOCKET_ENV,
    }),
    vue: "Vue",
    "vue-router": "VueRouter",
    "vue-socket.io": "VueSocketIO",
    "vee-validate": "VeeValidate",
    adapterjs: "AdapterJS",
    // rtcmulticonnection: "RTCMultiConnection",
  },
};
