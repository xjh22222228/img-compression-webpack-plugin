const ImgCompressionWebpackPlugin = require('../index');

module.exports = {
  plugins: [
    new ImgCompressionWebpackPlugin({ key: 123 })
  ]
};
