import React from 'react';
// manbe dont need coz not used there
// import ImageRadioImgOption from './image-radio-img-option';
import ActionCreators from '../actions/action-creators';
import LayerOptionsStore from '../stores/layer-options-store';
import URL from '../utils/url';

class ImageRadioPatternOption extends React.Component {
  clickHandler(layer, option, display) {
    ActionCreators.updateLayerOption(layer, option);
    ActionCreators.updateLayerOption(layer + '-display', display);
  }

  getPatternOptions() {
    let selected = LayerOptionsStore.getLayerValue(this.props.field);

    return this.props.option.options.map(option => {
      let clickHandler = this.clickHandler.bind(this, this.props.field, option.value, option.imgSrc);
      let classes = 'pbc-pattern-option pbc-option-grid-item' + (selected === option.value ? ' selected' : '');
      let props = {
        className: classes,
        key: option.value,
        src: `${URL.root()}/option_images/${option.imgSrc}`,
      };

      return <img {...props} onClick={clickHandler} />;
    });
  }

  render() {
    let patternOptions = this.getPatternOptions();
    let previewUrl = `${URL.root()}/option_images/${this.props.option.groupImg}`;

    return (
      <div className="pbc-pattern-select pbc-option-grid-item">
        <img src={previewUrl} key={this.props.option.value} />
        <span className="pbc-additional-options-indicator"></span>

        <div className="pbc-pattern-options">
          {patternOptions}
        </div>
      </div>
    );
  }
}

export default ImageRadioPatternOption;
