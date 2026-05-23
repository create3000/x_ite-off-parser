# x_ite-off-parser

OFF 3D File Format Parser for [X_ITE](https://create3000.github.io/x_ite/)

## Usage

Include the script after X_ITE:

```html
<script defer src="https://cdn.jsdelivr.net/npm/x_ite@15.0.3/dist/x_ite.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/x_ite-off-parser@1.0.2/dist/x_ite-off-parser.js"></script>
<!-- or as ES module -->
<script type="module" src="https://cdn.jsdelivr.net/npm/x_ite@15.0.3/dist/x_ite.min.mjs"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/x_ite-off-parser@1.0.2/dist/x_ite-off-parser.js"></script>
```

Now you can load OFF files:

```html
<x3d-canvas src="cube.off"></x3d-canvas>
```

You can also install it from npm:

```sh
npm i x_ite-off-parser
```

## License

x_ite-off-parser is free software and licensed under the [MIT License](LICENSE.md).
