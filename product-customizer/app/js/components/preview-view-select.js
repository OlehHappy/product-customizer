import React from 'react';
import URL from '../utils/url';

class PreviewViewSelect extends React.Component {
  getThumbnailUrl(view) {
    let regex = new RegExp(`-${view.index}.jpg|-${view.index}_\\S+.jpg`);
    return this.props.images.filter(image => {
      return image.match(regex);
    })[0];
  }

  getViews() {
    let views = [];

    this.props.product.views.forEach(view => {
      let classes = 'pbc-preview-option';
      let thumbUrl = this.getThumbnailUrl(view);
      let selectView = this.props.selectView.bind(this, view.key);

      if (view.key === this.props.selectedView.key) {
        classes += ' selected';
      }

      views.push(
        <img
          className={classes}
          onClick={selectView}
          key={view.key}
          src={thumbUrl}
          height="57"
          width="100" />
      );
    });

    return views;
  }

  render() {
    let views = this.getViews();

    return (
      <div>
        {views}
      </div>
    );
  }
}

export default PreviewViewSelect;
