import React from 'react';
import ActionCreators from '../actions/action-creators';
import LayerOptionsStore from '../stores/layer-options-store';

class ImageUpload extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  pickFile() {
    filepicker.setKey('AGewTAucGQlOMBc25KFeCz');

    filepicker.pick(
      {
        mimetype: 'image/*',
        container: 'modal',
        services: ['COMPUTER', 'FACEBOOK', 'INSTAGRAM', 'GOOGLE_DRIVE', 'DROPBOX', 'BOX', 'SKYDRIVE', 'PICASA', 'FLICKR', 'GMAIL', 'URL', 'IMAGE_SEARCH', 'WEBCAM']
      },
      file => {
        ActionCreators.updateLayerOption(this.props.option.field, file.url);
        ActionCreators.updateLayerOption('selectedView', this.props.product.views[0]);
        this.setState({ file: file });
      },
      error => {
        console.log(error.toString());
      }
    );
  }

  removeUpload() {
    ActionCreators.updateLayerOption(this.props.option.field, undefined);
    this.setState({ file: null });
  }

  render() {
    let url = LayerOptionsStore.getLayerValue(this.props.option.field);
    let pickFile = this.pickFile.bind(this);
    let content = <button className="pbc-upload pbc-file-text pbc-file-upload" onClick={pickFile}>Upload Image</button>;

    if (this.state.file && this.state.file.url) {
      url = this.state.file.url;
    }

    if (url) {
      content = (
        <div className="pbc-upload pbc-file-preview">
          <div className="pbc-file-remove pbc-file-text" onClick={this.removeUpload.bind(this)}>
            Click to Remove
          </div>
          <img src={`${url}/convert?w=65&h=65&fit=max`} />
        </div>
      );
    }

    return content;
  }
}

export default ImageUpload;
