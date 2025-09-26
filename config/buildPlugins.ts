import dotenv from "dotenv";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { DefinePlugin } from "webpack";

dotenv.config();
export function buildPlugins() {
  return [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
    new DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ];
}
