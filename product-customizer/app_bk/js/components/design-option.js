import React from 'react';
import LayerOptionsStore from '../stores/layer-options-store';
import ImageRadio from './image-radio';
import Text from './text';
import Dropdown from './dropdown';
import ImageUpload from './image-upload';
import HelpText from './help-text';

class DesignOption extends React.Component {
  constructor(props) {
    super();

    this.state = {
      currentValue: this.getCurrentValue(props)
    };
  }

  componentDidMount() {
    LayerOptionsStore.addChangeListener(() => {
      this.setState({
        currentValue: this.getCurrentValue(this.props)
      });
    });
  }

  getCurrentValue(props) {
    return LayerOptionsStore.getLayerValue(props.option.field);
  }

  getComponent() {
    switch (this.props.option.type) {
      case 'ImageRadio': return ImageRadio;
      case 'Text': return Text;
      case 'Dropdown': return Dropdown;
      case 'ImageUpload': return ImageUpload;
    };
  }

  render() {
    let Component = this.getComponent();
    let fieldLabel = this.props.option.label ? <h3>{this.props.option.label}</h3> : '';

    if (this.props.option.helpText || this.props.option.helpLink) {
      return (
        <div className={`design-option-${this.props.option.type}`}>
          {fieldLabel}
          <Component
            product={this.props.product}
            option={this.props.option}
            currentValue={this.state.currentValue} />
          <HelpText product={this.props.product} simple={this.props.simple} option={this.props.option} />
        </div>
      );
    }

    if (fieldLabel != '') {
      return (
        <div>
          {fieldLabel}
          <Component product={this.props.product} option={this.props.option} currentValue={this.state.currentValue} />
        </div>
      );
    }

    return (
      <Component product={this.props.product} option={this.props.option} currentValue={this.state.currentValue} />
    );
  }
}

export default DesignOption;
