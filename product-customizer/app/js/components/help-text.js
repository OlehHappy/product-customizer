import React from 'react';
import CustomToolButton from './custom-tool-button';
import URL from '../utils/url';

class HelpText extends React.Component {
  helpLink() {
    let link = this.props.option.helpLink;

    if (link === 'CustomToolButton') {
      return (
        <CustomToolButton simple={this.props.simple} product={this.props.product} />
      );
    }

    let linkURL = `${URL.root()}/help_images/${link}`;

    return (
      <a className="fancybox" href={linkURL}>
        {this.props.option.helpLinkText}
      </a>
    );
  }

  render() {
    let text = this.props.option.helpText || '';
    let linkText = this.props.option.helpLink;
    let link = linkText ? this.helpLink() : '';

    if (text !== '' || link !== '') {
      return (
        <p className="pbc-design-step-help">{text} {link}</p>
      );
    }

    return <div/>;
  }
}

export default HelpText;
