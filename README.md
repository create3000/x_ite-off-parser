# x_ite-off-parser

[![npm Version](https://img.shields.io/npm/v/x_ite-off-parser)](https://www.npmjs.com/package/x_ite-off-parser)
[![Build Size](https://img.shields.io/bundlephobia/minzip/x_ite-off-parser)](https://bundlephobia.com/package/x_ite-off-parser)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/x_ite-off-parser/badge?style=rounded)](https://create3000.github.io/jsdelivr-download-stats/?username=create3000&repository=x_ite)
[![npm Downloads](https://img.shields.io/npm/dm/x_ite-off-parser)](https://npmtrends.com/x_ite-off-parser)

OFF 3D File Format Parser for [X_ITE](https://create3000.github.io/x_ite/)

## Usage

Include the script after X_ITE:

```html
<script defer src="https://cdn.jsdelivr.net/npm/x_ite@VERSION/dist/x_ite.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/x_ite-off-parser@1.0.9/dist/x_ite-off-parser.min.js"></script>
<!-- or as ES module -->
<script type="module" src="https://cdn.jsdelivr.net/npm/x_ite@VERSION/dist/x_ite.min.mjs"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/x_ite-off-parser@1.0.9/dist/x_ite-off-parser.min.js"></script>
```

Now you can directly load `.off` files with the `src` attribute, but you also have to add the `extensions` attribute with a number, how many X_ITE extension you have included. Each extension will decrease this count and when it becomes `0`, the canvas knows that all extensions are loaded and now starts loading the file in the `src` attribute.

You can also use `.off` files as source of an Inline node.

```html
<x3d-canvas src="cube.off" extensions="1"></x3d-canvas>
```

## NPM

You can also install it from npm:

```sh
npm i x_ite-off-parser
```

## License

x_ite-off-parser is free software and licensed under the [MIT License](LICENSE.md).
