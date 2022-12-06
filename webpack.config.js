const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    const filePath = path.resolve(__dirname, `${templateDir}/${name}.${extension}`);
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: `${filePath}`,
      inject: true,
      alwaysWriteToDisk: true
    })
  })
}

const htmlPlugins = generateHtmlPlugins('./src/pages');

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.js',
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, './build'),
    },
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sass|css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              url: false
            }
          },
          {
            loader: 'sass-loader',
            options: {sourceMap: true}
          }
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'assets/images',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'assets/fonts',
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
    ...htmlPlugins,
    new CopyWebpackPlugin([
      {
        from: './fonts',
        to: './fonts'
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: './images',
        to: './images'
      }
    ]),
  ],
}

module.exports = config;
