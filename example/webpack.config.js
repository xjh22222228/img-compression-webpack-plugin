const path = require('path');
const ImgCompressionWebpackPlugin = require('../index');

module.exports = {
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new ImgCompressionWebpackPlugin({ key: 'g42bcJDlmLG8HhGgxcZV79zTRq6mH8G6' })
    // ...
  ]
};
