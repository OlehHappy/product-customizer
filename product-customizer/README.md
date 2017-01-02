## Getting Started

Install the project's command line tools globally:

```sh
npm install -g jspm node-sass
```

Install the project's dependencies:

```sh
npm install
jspm install
```

Start the server:

```sh
npm run server
```

To create the build of main.js:

```sh
npm run build:js
```

To create the build of main.css:

```sh
npm run build:css
```


## Using Local Product Images

The `product_images/` directory is ignored in this project. Copy images over to that directory so the follow URL structure can be achieved for requests:

```
http://localhost:3000/product_images/{product}-{view}-{option}.png
```

For example:

```
http://localhost:3000/product_images/bed-side-piping-orange.png
```

## Roadmap

* [x] Product preview component
* [x] Design step component
* [x] Image radio component
  * [x] Images
  * [x] Colors
  * [x] Patterns
* [x] Dropdown component
* [x] Text component
* [x] File input component
* [x] Highlight selected options
* [x] Render pet name layer
* [x] View select (top, side, front)
* [x] Write task for production builds
* [x] Set up content on S3
* [x] Add ability to serialize and parse params in query string
* [x] Connect file inputs to Filepicker
* [x] Test embedding in Shopify theme
* [x] Write styles to match mockups
* [x] Render product price and update based on attributes
* [x] Add to cart button (Shopify API call and redirect)
* [x] Add third view for products
* [x] Pull in prices from variants
* [x] Finish customizer styles and Shopify template updates
* [x] Set up image/video gallery
* [x] Set up simple version of the tool
* [x] Render product information
* [x] Add links on basic editor to complex
* [x] Update product JSON files to match `bed.json`
* [x] Configure name properties for each view
* [ ] Render preview information under the add to cart button (not part of spec)
