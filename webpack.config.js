const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer();

const index = './assets/js/index';
const staffDashboardIndex = './assets/js/index.staffDashboard';

module.exports = {
  context: __dirname,

  entry: {
    // Default bundle
    main: index,
    // Bundles that are only loaded on certain environments
    // These will get unwieldy if we ever have more than 2 optional bundle components
    // (which is unlikely)
    mainWithStaffDashboard: [index, staffDashboardIndex],
  },

  output: {
    path: path.resolve('./assets/bundles/'),
    filename: '[name]-[hash].js',
    // This needs to be explicitly unset in order to work around an issue with
    // django-webpack-loader and STATIC_URL
    // https://github.com/owais/django-webpack-loader/issues/160#issuecomment-389352884
    publicPath: '',
  },

  plugins: [
    new BundleTracker({ filename: './webpack-stats.json' }),
    new MiniCssExtractPlugin({ filename: '[name]-[hash].css' }),
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json',
            // Allow TypeScript component names to be reflected into the
            // generated CSS class names of styled-components.
            getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
          },
        }],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
        ],
      },
    ],
  },

  resolve: {
    modules: ['assets/js', 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  // devtool: "source-map",
};
