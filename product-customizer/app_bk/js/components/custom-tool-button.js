import React from 'react';
import URL from '../utils/url';

class CustomToolButton extends React.Component {
  sendToComplexTool() {
    let queryParams = URL.buildQueryParams();
    window.location = this.props.product.complexUrl + '?' + queryParams;
  }

  render() {
    if (!this.props.simple) {
      return <span/>;
    }

    if (this.props.type === 'full') {
      return (
        <div className="pbc-customize-cta">
          <p>Do you want to choose your own colors?</p>
          <a
            onClick={this.sendToComplexTool.bind(this)}
            className="pbc-button-alt">Start Customizing</a>
        </div>
      );
    }

    return (
      <a
        onClick={this.sendToComplexTool.bind(this)}
        className="pbc-button-alt">Start Customizing</a>
    );
  }
}

export default CustomToolButton;
