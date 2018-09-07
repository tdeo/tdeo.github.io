import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-konva';

export default class MapTile extends React.Component {
  static propTypes = {
    src: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      image: null
    };
  }

  componentDidMount() {
    const image = new window.Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = () => {
      this.setState({ image: image });
    };
    image.src = this.props.src;
  }

  render() {
    return (
      <Image
        image={this.state.image}
        {...this.props}
      />
    );
  }
}
