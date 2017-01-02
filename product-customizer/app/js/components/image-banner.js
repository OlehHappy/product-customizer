import React, { Component } from 'react';
import LayerOptionsStore from '../stores/layer-options-store';
import ImageBannerOption from './image-banner-option';

export default class ImageBanner extends Component {
  renderSelect(option) {
    return option.options.map(opt => {
      return this.getSelectOption(opt);
    });
  }

  getSelectOption(opt) {
    let productType = LayerOptionsStore.getLayerValue('product');
    let props = {
      option: opt,
      field: this.props.option.field,
      selected: opt.value === this.props.currentValue,
      key: opt.value
    };

    switch (this.props.option.field) {
      case 'imgbanner':
        return <ImageBannerOption {...props} directory={'imgbanner'} />;
      default:
        return <ImageBannerOption {...props} />;
    };
  }

  render() {
    let select = this.renderSelect(this.props.option);
    let style = {
      display: 'inline-flex',
      flexFlow: 'row wrap'
    };

    return (
      <div className="design-option" style={style}>{select}</div>
    );
  }
}
