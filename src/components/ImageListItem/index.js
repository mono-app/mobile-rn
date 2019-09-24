import React from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

const INITIAL_STATE = { image: {}}

export default class ImageListItem extends React.Component{

  refreshDetail = async () => {
    const { image } = this.props;
    this.setState({ image });
  }

  constructor(props){
    super(props);
    this.state = INITIAL_STATE;
    this.refreshDetail = this.refreshDetail.bind(this);
  }

  componentDidMount(){ this.refreshDetail(); }

  render(){
    const window = Dimensions.get("window");
    return (
      <TouchableOpacity onPress={this.props.onPress} style={{ height: (window.width/3), width: (window.width/3), padding:4 }}>
        <FastImage 
          resizeMode="cover"
          source={{ uri: (this.state.image.uri)?this.state.image.uri :this.state.image.downloadUrl  }} 
          style={{ alignSelf: "stretch", flex: 1, borderRadius: 8}}/>

      </TouchableOpacity>
    )
  }
}
