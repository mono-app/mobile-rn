import React from "react";
import { View, Dimensions, FlatList } from "react-native";
import Image from 'react-native-scalable-image';

export default class PhotoGridPreviewScreen extends React.PureComponent{
  constructor(props){
    super(props);
    this.images = this.props.navigation.getParam("images");
  }

  componentDidMount(){ if(!this.images) this.props.navigation.goBack(); }
  
  render(){
    return(
      <FlatList
        style={{ flex: 1 }}
        data={this.images}
        renderItem={({ item, index }) => {
          let marginBottom = 16;
          if(this.images.length === 0) marginBottom = 0;
          else if(index === this.images.length - 1) marginBottom = 0;

          return (
            <View style={{ display: "flex", flex: 1, backgroundColor: "#E8EEE8", marginBottom }}>
              <Image 
                background={true}
                height={Dimensions.get("window").height}
                width={Dimensions.get("window").width}
                source={{ uri: item, cache: "only-if-cached" }}
                style={{ alignSelf: "center" }}/>
            </View>
          )
        }}/>
    )
  }
}