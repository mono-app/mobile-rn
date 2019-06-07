import React from "react";
import FastImage from "react-native-fast-image";

export default class SquareAvatar extends React.PureComponent{
  render(){
    const size = this.props.size? this.props.size: 70;
    const radius = this.props.radius? this.props.radius: 8;
    const style = { width: size, height: size, borderRadius: radius, ...this.props.style }
    return <FastImage style={style} source={{ uri: this.props.uri }}/>
  }
}