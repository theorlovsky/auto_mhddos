const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;

module.exports = () => {
  return {
    mode: 'production',
    entry: './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
    },
    plugins: [new CleanWebpackPlugin()],
    target: 'node',
    module: {
      rules: [
        {
          test: /\.ts$/i,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    experiments: {
      topLevelAwait: true,
    },
  };
};
