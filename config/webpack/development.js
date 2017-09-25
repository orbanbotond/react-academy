const environment = require('./environment')

module.exports = environment.toWebpackConfig()

// module: {
//   loaders: [
//     {
//       test: /\.jsx?$/,
//       exclude: /node_modules/,
//       loader: 'react-hot-loader!babel-loader'
//     },
//     {
//       test: /\.js$/,
//       exclude: /node_modules/,
//       loader: 'eslint-loader'
//     }
//   ]
// }

