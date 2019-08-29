import React from "react";
import GallerySwiper from "react-native-gallery-swiper";

const INITIAL_STATE = { images: [] };

export default class GallerySwiperScreen extends React.PureComponent {
  
  loadImages = async () => {
    const dimensions = {width: 1080, height: 1920}
    const newImages = await this.images.map((image) => {
      return {uri: image.downloadUrl, dimensions: dimensions}
    });
    this.setState({images: newImages})
}

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE
    this.loadImages = this.loadImages.bind(this)
    this.images = this.props.navigation.getParam("images", []);
    
  }

  componentDidMount(){
    this.loadImages()
  }

  render() {  
    return (
      <GallerySwiper
            images={this.state.images}
            initialNumToRender={this.state.images.length}
            sensitiveScroll={false}
        />
    );
  }
}
