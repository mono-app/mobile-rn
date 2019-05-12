import React from "react";
import RNFS from "react-native-fs";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default class PhotoGrid extends React.Component{
  getImagesBase64 = () => {
    const promises = this.props.images.map(item => {
      return RNFS.readFile(item.image.uri, "base64");
    })
    return Promise.all(promises);
  }

  getImagesPath = () => this.props.images.map(item => {
    return item.image.uri;
  })

  constructor(props){
    super(props);

    this.getImagesBase64 = this.getImagesBase64.bind(this);
    this.getImagesPath = this.getImagesPath.bind(this);
  }
  
  render(){
    const window = Dimensions.get("window");
    const firstImage = this.props.images.length !== 0? this.props.images[0]: null;
    const remainingImageCount = this.props.images.length - 5;

    return(
      <View style={{ backgroundColor: "white", flex: 1 }}>
        {this.props.images.length !== 0?(
          <Image source={{ uri: firstImage.image.uri }} style={{height: 200, ...styles.singleImage}}/>
        ):<View/>}

        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly" }}>
          {this.props.images.map((item, index) => {
            if((index > 0 && index < 4) || index === 4 && remainingImageCount === 0) return <Image key={index} source={{ uri: item.image.uri }} style={{ height: (window.width/4), flex: 1, ...styles.singleImage}}/>
            else if(index === 4 && remainingImageCount > 0) return (
              <View key={index} style={{ alignSelf: "stretch", flex: 1, height: (window.width/4) }}>
                <Image source={{ uri: item.image.uri }} style={{ alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, .7)", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "white" }}>+ {remainingImageCount}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    )
  }
}

PhotoGrid.defaultProps = { images: [] }

const styles = StyleSheet.create({
  singleImage: { alignItems: "stretch", resizeMode: "cover" }
})