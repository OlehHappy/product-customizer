import React from 'react';
import ReactDOM from 'react-dom';
import ActionCreators from '../actions/action-creators';

export default class Text extends React.Component {
  submitHandler(event) {
    let petName = encodeURIComponent(ReactDOM.findDOMNode(this.refs.name).value);

    ActionCreators.updateLayerOption(this.props.option.field, petName);
    ActionCreators.updateLayerOption('selectedView', this.props.product.views[0]);
    event.preventDefault();
  }

  render() {
    let submitHandler = this.submitHandler.bind(this);

    return (
      <div className="pbc-text-and-submit clearfix">
        <input
          type="text"
          ref="name"
          onKeyUp={submitHandler}
          placeholder="Enter your pet's name." />
      </div>
    );
  }
}
