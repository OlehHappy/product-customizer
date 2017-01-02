import React, { Component } from 'react';
import ActionCreators from '../actions/action-creators';
import URL from '../utils/url';

export default class ImageBannerOption extends Component {
  clickHandler(props) {
    ActionCreators.updateLayerOption(props.field, props.option.value);
  }

  checkIfSelected() {
    if (!this.variantSelect) {
      return false;
    }

    let variant = ShopifyDataStore.getValue('selectedVariant');

    if (!variant) {
      return false;
    }

    return variant.title === this.props.option.value;
  }

  render() {
    let clickHandler = this.clickHandler.bind(this, this.props);
    let classes = 'pbc-image-radio-img' + (this.props.selected ? ' selected' : '');
    let selected = this.checkIfSelected();

    return (
      <div className="pbc-image-radio-img-container">
        <img
          className={classes}
          onClick={clickHandler}
          src={`${URL.root()}/product_images/imgbanner/${this.props.option.displayUrl}`} width="56" height="56" />
      </div>
    );
  }
}
