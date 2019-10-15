import React from "react";
import FastImage from "react-native-fast-image";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";

const INITIAL_STATE = {
  isLoaded: false,
};
export default class SquareAvatar extends React.PureComponent {

  handleLoadedImage =()=>{
    if(this._isMounted) this.setState({isLoaded:true})
  }

  constructor(props) {    
    super(props);
    this._isMounted = null
    this.state = INITIAL_STATE;
    this.handleLoadedImage = this.handleLoadedImage.bind(this)
  }

  
  componentDidMount(){
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render(){
    const size = this.props.size? this.props.size: 70;
    const radius = this.props.radius? this.props.radius: 8;
    const style = { width: size, height: size, borderRadius: radius, ...this.props.style }
    return (
      <View style={{...style}}>
        {(!this.state.isLoaded)?
          <ActivityIndicator style={{position:"absolute", top:"35%", left:"38%"}} size="small" animating={true} color="#0EAD69"/>
        :<View/>}
        <FastImage style={[style, (!this.state.isLoaded)?{opacity: 0 } :{}]} source={{ uri: this.props.uri }} resizeMode="cover" onLoad={this.handleLoadedImage}/>
      </View>
    )


  }
}