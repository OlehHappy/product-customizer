import React from 'react';
import ActionCreators from '../actions/action-creators';
import URL from '../utils/url';

class ImageRadioImgOption extends React.Component {
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
          src={`${URL.root()}/product_images/${this.props.directory}/${this.props.option.displayUrl}`} width="56" height="56" />
      </div>
    );
  }
}

export default ImageRadioImgOption;
