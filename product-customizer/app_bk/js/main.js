import React from 'react';
import ReactDOM from 'react-dom';
import ProductCustomizer from './components/product-customizer';
import ENV from './utils/env';

let element = document.getElementById('product-customizer');

if (element) {
  // Some hackery here to get the product from the attributes of the div#product-customizer element
  // in order to make things dynamic in production.
  let product = element.getAttribute('product');
  let simple = element.getAttribute('simple');
  let shopifyData = JSON.parse(String(element.getAttribute('shopify-data')));
  let shopifyMeta = JSON.parse(String(element.getAttribute('shopify-meta')));
  let shopifyImages = JSON.parse(String(element.getAttribute('shopify-images')));
  let shopifyDescription = JSON.parse(String(element.getAttribute('shopify-description')));
  let shopifyFeatures = JSON.parse(String(element.getAttribute('shopify-features')));

  ReactDOM.render(
    <ProductCustomizer
      simple={simple}
      shopifyData={shopifyData}
      shopifyMeta={shopifyMeta}
      shopifyImages={shopifyImages}
      shopifyDescription={shopifyDescription}
      shopifyFeatures={shopifyFeatures} />,
    document.getElementById('product-customizer')
  );
}
