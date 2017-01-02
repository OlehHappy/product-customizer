import React from 'react';
import DesignStep from './design-step';
import AddToCartButton from './add-to-cart-button';
import CustomToolButton from './custom-tool-button';
import LayerOptionsStore from '../stores/layer-options-store';
import ShopifyDataStore from '../stores/shopify-data-store';
import ActionCreators from '../actions/action-creators';
import URL from '../utils/url';

class ProductOptions extends React.Component {
  constructor(props) {
    super();
    let qty = LayerOptionsStore.getLayerValue('quantity');
    let initialPrice = ShopifyDataStore.getValue('selectedVariant').price * qty / 100;
    this.state = {
      layerOptions: LayerOptionsStore.getAllLayerOptions(),
      price: initialPrice.toFixed(2)
    };
  }

  componentDidMount() {
    LayerOptionsStore.addChangeListener(() => {
      this.setState({
        layerOptions: LayerOptionsStore.getAllLayerOptions(),
        price: this.getPrice()
      });
    });
  }

  getProductOptions() {
    let index = 1;
    let productOptions = [];

    this.props.product.steps.forEach(step => {
      if (this.props.simple && !step.simple) {
        return;
      }

      let last = index === this.props.product.steps.length;

      productOptions.push(
        <DesignStep product={this.props.product} step={step} index={index} key={index} last={last} simple={this.props.simple} />
      );

      index++;
    });

    return productOptions;
  }

  setQuantity(quantity) {
    this.setState({
      price: this.getPrice(quantity),
    });
    ActionCreators.updateLayerOption('quantity', quantity);
  }

  handleQuantityUpdate(event) {
    let quantity = event.target.value;

    this.setQuantity(quantity);
  }

  incrementQuantity() {
    let quantity = parseInt(this.state.layerOptions.quantity) + 1;
    this.setQuantity(quantity);
  }

  decrementQuantity() {
    let quantity = parseInt(this.state.layerOptions.quantity) - 1;

    if (quantity <= 0) {
      return;
    }

    this.setQuantity(quantity);
  }

  getPrice(quantity) {
    let qty = quantity || this.state.layerOptions.quantity;
    let total = ShopifyDataStore.getValue('selectedVariant').price * qty / 100;

    return total.toFixed(2);
  }

  infoOptions() {
    switch(this.props.product.key) {
      case "bed":
        return ['top', 'side', 'piping'];
      case "blanket":
        return ['top', 'piping'];
      case "bone":
        return ['color'];
      case "coat":
        return ['main', 'inner', 'piping'];
      case "collar":
        return ['ribbon', 'buckle'];
      case "frisbee":
        return ['color'];
      case "hoodie":
        return ['main', 'piping'];
      case "leash":
        return ['ribbon'];
      case "placemat":
        return ['top', 'piping'];
      case "basket":
        return ['top', 'piping'];
      case "crate":
        return ['main'];
      case "sherpa":
        return ['main'];
    }
  }

  optionDisplayHtml(display) {
    let regex = new RegExp(`\\S+.png|\\S+.jpg`);

    if (display.match(regex)) {
      let displayUrl = `${URL.root()}/option_images/${display}`;
      return `<span class="option-display option-display-img"><img src=${displayUrl} /></span>`;
    }

    return `<span class="option-display option-display-color" style="background: #${display}"></span>`;
  }

  currentSelectedOptions() {
    let infoOptions = this.infoOptions();
    let optionOutput = '';

    infoOptions.forEach(option => {
      let optionName = option.toUpperCase();
      let optionDisplay = LayerOptionsStore.getLayerValue(option + '-display');
      let optionDisplayHtml = this.optionDisplayHtml(optionDisplay);

      optionOutput += `<div class="pbc-selected-option"><h4>${optionName}</h4>${optionDisplayHtml}</div>`;
    });

    return (
      <div className="pbc-current-selections">
        <h3>DESIGN INFO</h3>
        <div className="pbc-selected-options" dangerouslySetInnerHTML={{__html: optionOutput}}></div>
      </div>
    );
  }

  getAddToCartButton() {
    if (this.props.simple) {
      return;
    }

    let price = this.state.price;
    let quantity = this.state.layerOptions.quantity;
    let variant = ShopifyDataStore.getValue('selectedVariant').id;

    return (
      <AddToCartButton
        quantity={quantity}
        price={price}
        variant={variant} />
    );
  }

  render() {
    let price = this.state.price;
    let quantity = this.state.layerOptions.quantity;
    let title = this.props.shopifyData.title;
    let variant = ShopifyDataStore.getValue('selectedVariant').id;

    return (
      <div className="pbc-options">
        <h1 className="pbc-product-title">{title}</h1>

        <div className="pbc-price-quantity">
          <h3 className="pbc-price">${price}</h3>
          <form className="pbc-quantity">
            <span
              className="pbc-quantity-change decrement"
              onClick={this.decrementQuantity.bind(this)}>
              -
            </span>
            <label>Quantity</label>
            <input type="text" value={quantity} onChange={this.handleQuantityUpdate.bind(this)} />
            <span
              className="pbc-quantity-change increment"
              onClick={this.incrementQuantity.bind(this)}>
              +
            </span>
          </form>
        </div>

        {this.getAddToCartButton()}

        {this.getProductOptions()}

        <AddToCartButton
          quantity={quantity}
          price={price}
          variant={variant} />

        {this.currentSelectedOptions()}
        <CustomToolButton simple={this.props.simple} type="full" product={this.props.product} />
        <p className="pbc-callout">* All products may slightly vary in color and design depending on the type of screen you are looking through.</p>
      </div>
    );
  }
}

export default ProductOptions;
