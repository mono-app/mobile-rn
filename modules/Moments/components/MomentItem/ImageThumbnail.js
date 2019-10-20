import React from "react";
import { StyleSheet, Dimensions } from "react-native";

import FastImage from "react-native-fast-image";
import { ActivityIndicator, TouchableOpacity } from "react-native";

function ImageThumbnail(props){
  const imageSize = Dimensions.get("window").width / 3;
  const [isLoaded, setLoaded] = React.useState(false)
  const _isMounted = React.useRef(true);

  const handleLoadedImage = () => {
    if(_isMounted.current) setLoaded(true)
  }

  React.useEffect(() => {
    return () => _isMounted.current=false
  }, [])

  const styles = StyleSheet.create({
    imageContainer: { display: "flex", alignItems: "stretch", flex: 1, height: imageSize },
    imageItem: { 
      margin: 4, borderRadius: 8, flex:1, aspectRatio: 1, height: "100%" 
    },
    activityIndicator: { position: 'absolute',top: '40%',left:"40%" }
  });

  return (
    <TouchableOpacity style={[ styles.imageContainer, props.style ]} onPress={props.onPress}>
        {(!isLoaded)?
          <ActivityIndicator style={styles.activityIndicator} size="small" animating={true} color="#0EAD69"/>
        :null}
      <FastImage style={[ styles.imageItem, (!isLoaded)?{opacity: 0 } :{} ]} source={props.source} resizeMode="cover" onLoad={handleLoadedImage}/>
    </TouchableOpacity>
  )

}
export default ImageThumbnail;