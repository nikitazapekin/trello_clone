import type webpack from "webpack";

export function buildLoaders(isDev: boolean): webpack.RuleSetRule[] {
  return [
    {
      test: /\.(tsx|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          envName: isDev ? "development" : "production",
        },
      },
    },
    {
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "ts-loader",
        options: {
          compilerOptions: {
            noEmitOnError: false,
            incremental: true,
            skipLibCheck: true,
          },
          transpileOnly: isDev,
          happyPackMode: true,
        },
      },
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    },
    {
      test: /\.(png|jpg|jpeg|gif|webp|svg)$/i,
      type: "asset/resource",
      generator: {
        filename: "images/[name].[contenthash][ext]",
      },
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: "asset/resource",
      generator: {
        filename: "fonts/[name].[contenthash][ext]",
      },
    },
  ];
}
