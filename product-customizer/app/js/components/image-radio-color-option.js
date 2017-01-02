import React from 'react';
import ActionCreators from '../actions/action-creators';

class ImageRadioColorOption extends React.Component {
  clickHandler(layer, option) {
    ActionCreators.updateLayerOption(layer, option.value);
    ActionCreators.updateLayerOption(layer + '-display', option.display);
  }

  render() {
    let clickHandler = this.clickHandler.bind(this, this.props.field, this.props.option);
    let classes = 'pbc-image-radio-color pbc-option-grid-item' + (this.props.selected ? ' selected' : '');
    let style = { background: `#${this.props.option.display}` };

    return (
      <div className={classes} onClick={clickHandler} style={style}></div>
    );
  }
}

export default ImageRadioColorOption;
