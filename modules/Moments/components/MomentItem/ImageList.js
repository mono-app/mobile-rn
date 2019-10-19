import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { withNavigation } from "react-navigation";

import ImageThumbnail from "modules/Moments/components/MomentItem/ImageThumbnail";
import { View, FlatList } from "react-native";

function ImageList(props){
  const { images, navigation } = props;
  const imageSize = (Dimensions.get("window").width/3) + 10;
  const styles = StyleSheet.create({ 
    imagesContainer: { display: "flex", flexDirection: "row", marginTop: 4, marginBottom: 4, flexGrow: 1 },
  })

  const handlePicturePress = (index) => {
    payload = { index, images }
    navigation.navigate("GallerySwiper", payload);
  }

  if(images.length <= 0) return null;
  return (
    <View style={{height: imageSize}}>
      <FlatList 
        style={styles.imagesContainer} data={images} 
        horizontal={true} keyExtractor={(item) => item.downloadUrl}
        renderItem={({ item, index }) => {
          return <ImageThumbnail source={{ uri: item.downloadUrl }} onPress={() => handlePicturePress(index)}/>
        }}/> 
    </View>
  );
}
export default withNavigation(ImageList);