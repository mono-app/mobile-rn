import React from "react";
import shorthash from "shorthash";
import { Dimensions, FlatList } from "react-native";

import FastImage from "react-native-fast-image";

const INITIAL_STATE = { images: {} }

export default class PhotoGridPreviewScreen extends React.PureComponent{
  handleImageLoaded = (width, height, hashedUrl) => {
    const newImages = JSON.parse(JSON.stringify(this.state.images));
    if(!newImages[hashedUrl]) newImages[hashedUrl] = {}
    newImages[hashedUrl].height = Dimensions.get("window").width * height / width;
    this.setState({ images: newImages });
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.images = this.props.navigation.getParam("images");
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
  }

  componentDidMount(){ if(!this.images) this.props.navigation.goBack(); }
  
  render(){
    return(
      <FlatList
        style={{ flex: 1, backgroundColor: "#E8EEE8" }}
        data={this.images}
        extraData={this.state}
        renderItem={({ item, index }) => {
          let marginBottom = 16;
          if(this.images.length === 0) marginBottom = 0;
          else if(index === this.images.length - 1) marginBottom = 0;

          const hashedUrl = shorthash.unique(item);
          const computedHeight = this.state.images[hashedUrl]? this.state.images[hashedUrl].height: 200;

          return (
            <FastImage
              key={hashedUrl}
              onError={() => console.log("ops")}
              style={{ width: Dimensions.get("window").width, height: computedHeight, marginBottom }}
              source={{ uri: item }}
              resizeMode={FastImage.resizeMode.contain}
              onLoad={e => this.handleImageLoaded(e.nativeEvent.width, e.nativeEvent.height, hashedUrl )}/>
          )
        }}/>
    )
  }
}