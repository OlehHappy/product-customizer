import React, { Component, PropTypes } from 'react';
import ItemTypes from '../constants/ItemTypes';
import { DragSource } from 'react-dnd';

const style = {
  position: 'absolute',
  cursor: 'move'
};

const imgSource = {
  beginDrag(props) {
    const { src, left, top, zIndex } = props;
    return { src, left, top, zIndex };
  }
};

export default class BannerPreview extends Component {
  propTypes: {
    connectDragSource: PropTypes.func.isRequired,
    src: PropTypes.string.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    zIndex: PropTypes.number.isRequired
  };

  render() {
    const { connectDragSource, id, src, left, top, zIndex } = this.props;

    return (
      connectDragSource(
        <img src = {src} style = {{ ...style, left, top, zIndex }} key = {id} />
      )
    );
  }
}

export default DragSource(ItemTypes.Item, imgSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource()
}))(BannerPreview);
