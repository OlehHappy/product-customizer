import React from 'react';
import LayerOptionsStore from '../stores/layer-options-store';
import ShopifyDataStore from '../stores/shopify-data-store';

class AddToCartButton extends React.Component {
  addToCart() {
    let cartParams = this.cartParams();

    $.post('/cart/add.js', cartParams, function(response) {
      window.location = '/cart';
    }, 'json');
  }

  cartParams() {
    let param;
    let params = {
      properties: Object.assign({}, { 'type': ShopifyDataStore.getValue('productType') }, LayerOptionsStore.getAllLayerOptions()),
      id: this.props.variant,
      quantity: this.props.quantity
    };

    let noDependentProperty = (param) => {
      switch (param) {
        case 'font':
          return params.properties.text;
        case 'banner':
          return params.properties.text;
        case 'textcolor':
          return params.properties.text;
        default:
          return true;
      }
    }

    let isEmpty = (param) => {
      return !params.properties[param];
    }

    let isBlacklisted = (param) => {
      let blacklistedParams = ['currentStep', 'product', 'selectedView', 'banner-display', 'piping-display', 'textcolor-display', 'top-display', 'side-display', 'main-display', 'inner-display', 'ribbon-display', 'variant', 'color-display', 'buckle-display'];

      return blacklistedParams.indexOf(param) !== -1;
    }

    // Clean out unused and blacklisted properties (could be moved to a new store)
    for (param in params.properties) {
      if (isEmpty(param) || isBlacklisted(param) || !noDependentProperty(param)) {
        delete params.properties[param];
      } else {
        // Transform valid params
        switch (param) {
          case 'text':
            params.properties.text = decodeURIComponent(params.properties.text);
            break;
        }
      }
    }

    return params;
  }

  render() {
    return (
      <button
        className="pbc-button"
        type="button"
        onClick={this.addToCart.bind(this)}>
        Add To Cart
      </button>
    );
  }
}

export default AddToCartButton;
