import React from 'react';
import ActionCreators from '../actions/action-creators';
import LayerOptionsStore from '../stores/layer-options-store';
import PreviewViewSelect from './preview-view-select';
import URL from '../utils/url';

class ProductPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layerOptions: LayerOptionsStore.getAllLayerOptions()
    };
  }

  componentDidMount() {
    LayerOptionsStore.addChangeListener(this.refreshState.bind(this));
  }

  refreshState() {
    this.setState({
      layerOptions: LayerOptionsStore.getAllLayerOptions()
    });
  }

  productImageLayers() {
    let layers = [];

    this.state.layerOptions.selectedView.layers.forEach(layer => {
      let imageUrl, def;
      let layerOpts = this.state.layerOptions;
      let imageStyle = { zIndex: layer.zIndex };

      // TODO: Figure out why these exist.
      if (layer.type === 'none') return;

      if (layer.type === 'text') {
        if (!layerOpts.text) return;

        let banner = (layerOpts.banner !== undefined ? '&banner=' + layerOpts.banner : '');

        imageUrl = `http://pridebites.azurewebsites.net/DynamicImage?text=${layerOpts.text}${banner}&font=${layerOpts.font}&textColor=${layerOpts.textcolor}`;

        for (def in layer.defaults) {
          if (def === 'imgSrc' && !this.imagesUploaded()) {
            // Swallow this one.
          } else {
            imageUrl += `&${def}=${layer.defaults[def]}`;
          }
        }
      } else if (layer.type === 'static') {
        imageUrl = `${URL.root()}/product_images/${this.props.product.key}/${layer.key}.png`;
      } else {
        imageUrl = `${URL.root()}/product_images/${this.props.product.key}/${this.props.product.key}-${this.state.layerOptions.selectedView.key}-${layer.key}-${layerOpts[layer.key]}.png`;
      }

      layers.push(
        <img
          src={imageUrl}
          className="pbc-preview-layer"
          style={imageStyle}
          key={layer.zIndex} />
      );
    });

    return layers;
  }

  imagesUploaded() {
    let images = Object.keys(this.state.layerOptions).filter(option => {
      if (option.match(/image/)) {
        return this.state.layerOptions[option];
      }

      return false;
    });

    return !!images.length;
  }

  selectView(viewKey) {
    if (viewKey === this.state.layerOptions.selectedView.key) return;

    this.props.product.views.forEach(view => {
      if (view.key === viewKey) {
        ActionCreators.updateLayerOption('selectedView', view);
      }
    });
  }

  render() {
    let productImageLayers = this.productImageLayers();
    let selectView = this.selectView.bind(this);
    let selectedView = this.state.layerOptions.selectedView;
    let previewStyle = {
      flexGrow: 3,
      position: 'relative'
    };

    return (
      <div className="pbc-preview" style={previewStyle}>
        <div className="pbc-preview-frame">{productImageLayers}</div>
        <PreviewViewSelect
          product={this.props.product}
          selectedView={selectedView}
          selectView={selectView}
          images={this.props.images} />

        <div className="pbc-additional-info">
          <div className="pbc-description">
            <h2>More Info</h2>
            <div dangerouslySetInnerHTML={{__html: this.props.description}}></div>
          </div>
          <div className="pbc-features">
            <h2>Features</h2>
            <div dangerouslySetInnerHTML={{__html: this.props.features}}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductPreview;
