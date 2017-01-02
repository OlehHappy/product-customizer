import LayerOptionsStore from '../stores/layer-options-store';
import ENV from './env';

const CDN_PATH = '//s3.amazonaws.com/pridebites-customizer';
// const API_KEY = '958d44a339793fe9954710cabc22e1e9'; before
const API_KEY = 'AKIAJGS6NPSBTYJOJBHA';
// const PASSWORD = '01e05a7461c3f0fe0e54bf9afccb6fc0'; before
const PASSWORD = 'i/yjG6GjqYtJp59Rm9YfD0xzZtsa2kyrJd1aYs+n';
const SHARED_SECRET = 'i/yjG6GjqYtJp59Rm9YfD0xzZtsa2kyrJd1aYs+n';

let URL = {
  buildQueryParams() {
    var opt;
    var params = [];

    let layerOptions = LayerOptionsStore.getAllLayerOptions();

    for (opt in layerOptions) {
      if (layerOptions[opt] && opt !== 'selectedView') {
        params.push(`${opt}=${layerOptions[opt]}`);
      }
    };

    return params.join('&');
  },

  root() {
    if (ENV.development()) {
      return '';
    }

    return CDN_PATH;
  },

  shopify: function(resource) {
    // return `https://${API_KEY}:${PASSWORD}@pridebites.myshopify.com/admin/orders.json`;
    return `https://05a45e5d51614328f99cc5ea00e1476b:24e8686cf67f567db62e6723ae610c2a@pridebites-customizer.myshopify.com/admin/orders.json`;
  }
};

export default URL;
