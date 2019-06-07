import React from "react";
import FastImage from "react-native-fast-image";

export default class CircleAvatar extends React.PureComponent{
  render(){
    const radius = this.props.size? this.props.size/2: 25;
    const size = this.props.size? this.props.size: 50;
    const style = { width: size, height: size, borderRadius: radius, ...this.props.style}
    return <FastImage style={style} source={{ uri: this.props.uri }}/>
  }
}