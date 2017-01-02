import events from 'events';
import ActionTypes from '../constants/action-types';
import AppDispatcher from '../dispatcher/app-dispatcher';

const CHANGE_EVENT = 'change';
let layerOptions = {};

let LayerOptionsStore = Object.assign({}, events.EventEmitter.prototype, {
  getAllLayerOptions() {
    return layerOptions;
  },

  getLayerValue(key) {
    return layerOptions[key];
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

LayerOptionsStore.setMaxListeners(20);

AppDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.UPDATE_PREVIEW_OPTION:
      layerOptions[action.layer] = action.value;
      LayerOptionsStore.emitChange();
      break;
    case ActionTypes.UPDATE_PREVIEW_OPTIONS:
      layerOptions = Object.assign({}, layerOptions, action.options);
      LayerOptionsStore.emitChange();
      break;
  };
});

export default LayerOptionsStore;
