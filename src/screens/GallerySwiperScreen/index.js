import React from "react";
import AppHeader from "src/components/AppHeader";
import SmartGallery from "react-native-smart-gallery";
import { View } from "react-native";

const INITIAL_STATE = { images: [] };

export default class GallerySwiperScreen extends React.PureComponent {
  static navigationOptions = () => { 
    return {
      header: null
    }
  }
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
    this.initialIndex = this.props.navigation.getParam("index", 0);
  }

  componentDidMount(){
    this.loadImages()
  }

  render() {  
    if(this.state.images.length>0){
      return (
        <View style={{flex: 1}}>
          <AppHeader navigation={this.props.navigation} style={{ backgroundColor: "#000" }}/>
          <SmartGallery
                    index={this.initialIndex}
                    images={this.state.images}
                    loadMinimal={true}
                    loadMinimalSize={2}
                    sensitiveScroll={false}
            
                  />
        </View>
      );
    }

    return null
    
  }
}
