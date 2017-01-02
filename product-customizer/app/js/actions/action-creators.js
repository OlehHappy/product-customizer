import ActionTypes from '../constants/action-types';
import AppDispatcher from '../dispatcher/app-dispatcher';

export default {
  updateLayerOption(layer, value) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_PREVIEW_OPTION,
      layer: layer,
      value: value
    });
  },

  updateLayerOptions(options) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_PREVIEW_OPTIONS,
      options: options
    });
  },

  updateShopifyData(key, value) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_SHOPIFY_DATA,
      key: key,
      value: value
    });
  },

  updateVariant(name) {
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_VARIANT,
      name: name
    });
  }
};
