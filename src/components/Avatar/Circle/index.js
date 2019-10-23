import React from "react";
import PropTypes from "prop-types";
import { View, ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";

function CircleAvatar(props){
  const { size, uri } = props;
  const [ isLoaded, setLoaded ] = React.useState(false);
  const _isMounted = React.useRef(true);

  const radius = size? size/2: 25;
  const styles ={
    default: { width: size, height: size, borderRadius: radius }
  }

  const handleLoadedImage =()=>{
    if(_isMounted.current) setLoaded(true)
  }
  
  React.useEffect(() => {
  
    ()=>{
      _isMounted.current = false
    }
  }, [])

  return (
    <View>
      {(!isLoaded || props.isLoading)?
        <ActivityIndicator style={{position:"absolute", top:"35%", left:"38%"}} size="small" animating={true} color="#0EAD69"/>
      :<View/>}
      <FastImage style={[styles.default,props.style, (!isLoaded || props.isLoading)?{opacity: 0 } :{}]} source={{ uri: uri }} onLoad={handleLoadedImage}/>
    </View>
  )
  
}

CircleAvatar.propTypes = { 
  size: PropTypes.number,
  style: PropTypes.any,
  uri: PropTypes.string.isRequired
}
CircleAvatar.defaultProps = { style: {}, size: 50 }
export default CircleAvatar;