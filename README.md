# img-compression-webpack-plugin



<p align="center">
	<br>
	<img src="media/screenshot.png" width="500">
	<br>
</p>




## Install

```bash
$ npm i img-compression-webpack-plugin -D
```

## API KEY
[Get API KEY](https://tinypng.com/developers)


## Usage

```js
// webpack.config.js

const ImgCompressionWebpackPlugin = require('img-compression-webpack-plugin');

module.exports = {
  plugins: [
    new ImgCompressionWebpackPlugin({ key: 'your api key' })
    // ...
  ]
};
```




## Questions & Suggestions

Please open an issue [here](https://github.com/xjh22222228/img-compression-webpack-plugin/issues).

## License

[MIT](LICENSE)
