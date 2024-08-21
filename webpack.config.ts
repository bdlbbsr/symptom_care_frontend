import path from "path";
import webpack, {Configuration} from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import {TsconfigPathsPlugin} from "tsconfig-paths-webpack-plugin";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
import 'webpack-dev-server';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;



const webpackConfig = (env:any): Configuration => {

    const isProduction = env.production === true;
    const envFile = isProduction ? '.env' : '.env';
    const envPath = path.resolve(__dirname, envFile);
    const envVars = require('dotenv').config({ path: envPath }).parsed || {};

    return {
    mode: isProduction ? "production" : 'development',
    entry: "./src/index.tsx",
    // ...(env.production || !env.development ? {} : {devtool: "eval-source-map"}),
    devtool: (env.development === true) ? 'eval-source-map' : false,
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [new TsconfigPathsPlugin()]
    },
    output: {
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                },
                exclude: /dist/
            },
           
                // {
                //   test: /\.(ts|tsx)$/,
                //   exclude: /node_modules/,
                //   use: {
                //     loader: "babel-loader",
                //     options: {
                //       presets: ["@babel/preset-env", "@babel/preset-react"],
                //     },
                //   },
                // },
                {
                  test: /\.(sa|sc|c)ss$/,
                  use: [MiniCssExtractPlugin.loader, 'css-loader', "sass-loader"],
                },
                
                {
                  test: /\.(png|jpg|gif|svg)$/,
                  type: "asset/resource",
                },
                {
                  test: /\.(woff|woff2|eot|ttf|otf)$/i,
                  type: "asset/resource",
                },
              
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public", "index.html"),
            filename: 'index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }),
            new webpack.HotModuleReplacementPlugin(),
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin(),
            new RemoveEmptyScriptsPlugin(),
            new BundleAnalyzerPlugin(),
        
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(envVars),
            // "process.env.PRODUCTION": env || !env.development,
            "process.env.NAME": JSON.stringify(require("./package.json").name),
            "process.env.VERSION": JSON.stringify(require("./package.json").version)
        }),
        new ForkTsCheckerWebpackPlugin(),
        new ESLintPlugin({files: "./src/**/*.{ts,tsx,js,jsx}"}),
        new CompressionPlugin({
          // Be very carefully with 'true', sometimes bug happens
          deleteOriginalAssets: false,
          algorithm: 'gzip',
          test: /\.(ts|tsx|js|jsx|css|html|svg|png|jpg|jpeg)$/,
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
          new CssMinimizerPlugin(),
          // new TerserPlugin(),
        ],
        splitChunks: {chunks: 'all'},
      },
      devServer: {
        static: {
          directory: path.join(__dirname, "public"),
        },
        compress: true,
        open: true,
        historyApiFallback: true,
        hot: true,
        port: 3000
      },
    
}};

export default webpackConfig;