import React, {Component} from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ProductPreview from './product-preview';
import ProductOptions from './product-options';
import ActionCreators from '../actions/action-creators';
import LayerOptionsStore from '../stores/layer-options-store';
import ShopifyDataStore from '../stores/shopify-data-store';
import URL from '../utils/url';

export default class ProductCustomizer extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    let productName = this.getProductName(this.props.shopifyData.type);

    this.storeShopifyData();

    $.getJSON(`${URL.root()}/product_data/${productName}.json`)
      .success(data => {
        let stateData = this.getInitialStateData(data);

        // TODO: Refactor so that we aren't creating actions in loops.
        this.setState(stateData);
        this.setInitialProductValues(stateData.product);
        this.setInitialSelectedView(stateData.selectedView);
        this.setAttributesFromShopifyData(stateData.product);
        this.setAttributesFromQueryParams();

        // Set a variable on the state so we know when the stores are fully populated.
        this.setState({
          isStoreLoaded: true
        });
      }).fail(error => {
        console.log(error);
      });
  }

  storeShopifyData() {
    ActionCreators.updateShopifyData('variants', this.props.shopifyData.variants);
    ActionCreators.updateShopifyData('selectedVariant', this.props.shopifyData.variants[0]);
    ActionCreators.updateShopifyData('productType', this.props.shopifyData.type);
  }

  getProductName(name) {
    let productType;

    ['bed', 'blanket', 'bone', 'coat', 'collar', 'frisbee', 'hoodie', 'leash', 'placemat', 'basket', 'crate', 'sherpa'].forEach(type => {
      if (name.match(new RegExp(type, 'i'))) {
        productType = type;
        return;
      }
    });

    return productType;
  }

  getInitialStateData(data) {
    return Object.assign(
      {},
      {
        loading: false,
        product: data,
        selectedView: data.views[0]
      }
    );
  }

  setInitialProductValues(product) {
    let layerOptions = {
      product: product.key,
      quantity: 1
    };

    product.steps.forEach(step => {
      step.customizations.forEach(customization => {
        let value = customization.selectedValue;

        layerOptions[customization.field] = value;

        if (customization.type === 'ImageRadio') {
          layerOptions[customization.field + '-display'] = this.getProductOptionDisplayByValue(customization.options, value);
        }

        // `variant` attribute is used to indicate the option is selecting a variant of the product.
        if (customization.variant) {
          ActionCreators.updateShopifyData('variantField', customization.field);
        }
      });
    });

    ActionCreators.updateLayerOptions(layerOptions);
  }

  setInitialSelectedView(selectedView) {
    ActionCreators.updateLayerOption('selectedView', selectedView);
  }

  getProductStepOptionsByKey(steps, key) {
    return steps.filter(function(step) {
      return step.customizations[0].field === key;
    }).map(function(step) {
      return step.customizations[0].options;
    });
  }

  getProductOptionDisplayByValue(options, value) {
    let stepOptions = options;
    let displayValue = '';
    for (let i = 0; i <= stepOptions.length - 1; i++) {
      if (stepOptions[i].options) {
        let nestedOptions = stepOptions[i].options;
        for (let x = 0; x <= nestedOptions.length - 1; x++) {
          if (nestedOptions[x].value == value) {
            displayValue = nestedOptions[x].imgSrc;
            break;
          }
        }
      }
      if (stepOptions[i].value == value) {
        displayValue = stepOptions[i].display;
        break;
      }
    }
    return displayValue;
  }

  getDisplayValue(key, value) {
    let productStepOptions = this.getProductStepOptionsByKey(this.state.product.steps, key);

    return this.getProductOptionDisplayByValue(productStepOptions[0], value);
  }

  setAttributesFromShopifyData() {
    if (!this.props.shopifyMeta) return;

    let key;
    // Passed in from the Shopify template: <div ... shopify-meta='{{ product.metafields.customizer | json }}'></div>
    let meta = this.props.shopifyMeta;

    for (key in meta) {
      let displayValue = this.getDisplayValue(key, meta[key]);
      ActionCreators.updateLayerOption(key, meta[key]);
      ActionCreators.updateLayerOption(key + '-display', displayValue);
    }
  }

  setAttributesFromQueryParams() {
    if (!location.search) return;

    var param;
    var params = {};
    var queryParams = location.search.replace('?', '').split('&');

    queryParams.forEach(queryParam => {
      param = queryParam.split('=');
      if (param[0] === ShopifyDataStore.getValue('variantField')) {
        ActionCreators.updateVariant(param[1]);
      }
      ActionCreators.updateLayerOption(param[0] ,param[1]);
    });
  }

  render() {
    if (!this.state.isStoreLoaded) {
      return <div/>;
    }

    if (!this.state.product) {
      return <div/>;
    }

    return (
      <div className="pbc-app-container">
        <ProductPreview
          selectedView={this.state.selectedView}
          selectedOptions={this.state.selectedOptions}
          product={this.state.product}
          images={this.props.shopifyImages}
          description={this.props.shopifyDescription}
          features={this.props.shopifyFeatures} />

        <ProductOptions
          simple={this.props.simple}
          product={this.state.product}
          shopifyData={this.props.shopifyData} />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(ProductCustomizer);
