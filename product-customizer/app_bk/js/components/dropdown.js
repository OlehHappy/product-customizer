import React from 'react';
import ActionCreators from '../actions/action-creators';
import ShopifyDataStore from '../stores/shopify-data-store';

class Dropdown extends React.Component {
  getOptions(options) {
    let opts = [];

    options.forEach(option => {
      opts.push(<option value={option.value} key={option.value}>{option.display}</option>)
    });

    return opts;
  }

  isVariantSelect() {
    return this.props.option.field === ShopifyDataStore.getValue('variantField');
  }

  changeHandler(event) {
    if (this.isVariantSelect()) {
      ActionCreators.updateVariant(event.target.value);
    }

    ActionCreators.updateLayerOption(this.props.option.field, event.target.value);
  }

  render() {
    let options = this.getOptions(this.props.option.options);
    let changeHandler = this.changeHandler.bind(this);

    return (
      <select onChange={changeHandler} value={this.props.currentValue}>
        {options}
      </select>
    );
  }
}

export default Dropdown;
