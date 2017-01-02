import React, { PropTypes, Component } from 'react';
import update from 'react/lib/update'
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ActionCreators from '../actions/action-creators';
import LayerOptionsStore from '../stores/layer-options-store';
import PreviewViewSelect from './preview-view-select';
import URL from '../utils/url';
import ItemTypes from '../constants/ItemTypes';
import BannerPreview from './banner-preview';

const destinationTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    const left = Math.round(item.left + delta.x);
    const top = Math.round(item.top + delta.y);

    component.moveImg(item.id, left, top);
  }
};

export default class ProductPreview extends Component {
  propTypes: {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired, // maybe we don need it
    canDrop: PropTypes.bool.isRequired // maybe we don need it
  };

  constructor(props) {
    super(props);

    this.state = {
      layerOptions: LayerOptionsStore.getAllLayerOptions(),
      banner: { top: 180, left: 80 }
    };
  }

  moveImg(id, left, top) {
    this.setState(update(this.state, {
      banner: {
        $merge: {
          left: left,
          top: top
        }
      }
    }));
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
      let classStyle = "pbc-preview-layer";
      let imageStyle = { zIndex: layer.zIndex };

      // TODO: Figure out why these exist.
      if (layer.type === 'none') {
        return;
      }

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
        layers.push(
          <img
            src={imageUrl}
            className={classStyle}
            style={imageStyle}
            key={layer.zIndex}/>
        );
      } else if (layer.type === 'static') {
        imageUrl = `${URL.root()}/product_images/${this.props.product.key}/${layer.key}.png`;
        layers.push(
          <img
            src={imageUrl}
            className={classStyle}
            style={imageStyle}
            key={layer.zIndex}/>
        );
      } else if (layer.type === 'banner') {
        if (!layerOpts.banner) return;
        imageUrl = `${URL.root()}/product_images/banner/${layerOpts.banner}-${layer.type}.png`;
        layers.push(
          <img
            src={imageUrl}
            className={classStyle}
            style={imageStyle}
            key={layer.zIndex}/>
        );
      } else if (layer.type === 'ImageBanner') {
        if (!layerOpts.imgbanner) return;
        imageUrl = `${URL.root()}/product_images/imgbanner/${layerOpts.imgbanner}-banner.png`;
        const {banner} = this.state;

        layers.push(
          <BannerPreview src={imageUrl}
               left={banner.left}
               top={banner.top}
               zIndex={layer.zIndex}
               key={layer.zIndex} />
        );

      } else {
        imageUrl = `${URL.root()}/product_images/${this.props.product.key}/${this.props.product.key}-${this.state.layerOptions.selectedView.key}-${layer.key}-${layerOpts[layer.key]}.png`;
        layers.push(
          <img
            src={imageUrl}
            className={classStyle}
            style={imageStyle}
            key={layer.zIndex}/>
        );
      }

      // layers.push(
      //   <img
      //     src={imageUrl}
      //     className={classStyle}
      //     style={imageStyle}
      //     key={layer.zIndex}
      //     _handlerTransform = {hTrans}
      //     _handlerDemo = {hDemo} />
      // );
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
    const { connectDropTarget } = this.props;
    let previewStyle = {
      flexGrow: 3,
      position: 'relative'
    };

    return connectDropTarget(
      <div className="pbc-preview" style={previewStyle}>
        <div className="pbc-preview-frame">
          {productImageLayers}
        </div>
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

export default DropTarget(ItemTypes.Item, destinationTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(ProductPreview);
