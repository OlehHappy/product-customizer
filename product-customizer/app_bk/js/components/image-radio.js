import React from 'react';
import LayerOptionsStore from '../stores/layer-options-store';
import ImageRadioImgOption from './image-radio-img-option';
import ImageRadioColorOption from './image-radio-color-option';
import ImageRadioPatternOption from './image-radio-pattern-option';

class ImageRadio extends React.Component {
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

    if (opt.options) {
      props.key = opt.display;
      return <ImageRadioPatternOption {...props} directory={productType} />;
    }

    switch (this.props.option.field) {
      case 'banner':
        return <ImageRadioImgOption {...props} directory={'banner'} />;
      case 'size':
        return <ImageRadioImgOption {...props} directory={productType} />;
      default:
        return <ImageRadioColorOption {...props} />;
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

export default ImageRadio;
