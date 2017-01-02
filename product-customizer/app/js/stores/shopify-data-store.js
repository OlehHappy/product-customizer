import events from 'events';
import ActionTypes from '../constants/action-types';
import AppDispatcher from '../dispatcher/app-dispatcher';

const CHANGE_EVENT = 'change';
let shopifyData = {};

let ShopifyDataStore = Object.assign({}, events.EventEmitter.prototype, {
  getValues() {
    return shopifyData;
  },

  getValue(key) {
    return shopifyData[key];
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.UPDATE_VARIANT:
      let newSelectedVariant = shopifyData.variants[0];

      shopifyData.variants.forEach(variant => {
        if (variant.title.toLowerCase() === action.name.toLowerCase()) {
          newSelectedVariant = variant;
        }
      });

      shopifyData.selectedVariant = newSelectedVariant;
      ShopifyDataStore.emitChange();
      break;
    case ActionTypes.UPDATE_SHOPIFY_DATA:
      shopifyData[action.key] = action.value;
      ShopifyDataStore.emitChange();
      break;
  };
});

export default ShopifyDataStore;
