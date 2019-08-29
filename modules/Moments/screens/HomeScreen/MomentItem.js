import React from "react";
import PeopleAPI from "src/api/people";
import { StyleSheet, Dimensions } from "react-native";

import SquareAvatar from "src/components/Avatar/Square";
import FastImage from "react-native-fast-image";
import { View, TouchableOpacity, FlatList } from "react-native";
import { Text, Surface, Caption } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";

export function MomentImageThumbnail(props){
  const imageSize = Dimensions.get("window").width/3;

  const styles = StyleSheet.create({
    imageContainer: { display: "flex", alignItems: "stretch", flex: 1, height: imageSize },
    imageItem: { 
      margin: 4, borderRadius: 8, flex:1, aspectRatio: 1, height: "100%" }
  })
  return (
    <TouchableOpacity style={[ styles.imageContainer, props.style ]}>
      <FastImage style={styles.imageItem} source={props.source} resizeMode="cover"/>
    </TouchableOpacity>
  )
}

function MomentItem(props){
  const { moment } = props;
  const [ people, setPeople ] = React.useState(null);
  const styles = StyleSheet.create({
    surface: { elevation: 16, padding: 16, display: "flex", flexDirection: "column", borderRadius: 4 },
    profile: { display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 8 },
    textContainer: { borderBottomColor: "#E8EEE8", borderBottomWidth: 1, paddingBottom: 8 }, 
    actionContainer: { display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingTop: 8 },
    actionItem: { display: "flex", flexDirection: "row", alignItems: "center", padding: 4 },
    imagesContainer: { display: "flex", flexDirection: "row", marginTop: 4, marginBottom: 4, flexGrow: 1 },
  })

  const fetchPeople = async () => {
    const peopleData = await PeopleAPI.getDetail(moment.posterEmail)
    setPeople(peopleData);
  }

  React.useEffect(() => {
    fetchPeople();
  }, [])

  if(people === null) return null;
  return (
    <Surface style={[ styles.surface, props.style ]}>
      <View style={styles.profile}>
        <SquareAvatar size={50} uri={people.profilePicture}/>
        <View style={{ marginLeft: 8 }}>
          <Text style={{ margin: 0, fontWeight: "bold" }}>{people.applicationInformation.nickName}</Text>
          <Caption style={{ margin: 0 }}>10 Agustus 2019 | Jam 10:15 WIB</Caption>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={{ textAlign: "justify" }}>{moment.content.message}</Text>
        <FlatList 
          style={styles.imagesContainer} data={moment.content.images} horizontal={true}
          renderItem={({ item }) => {
            return <MomentImageThumbnail source={{ uri: item.downloadUrl }}/>
          }}/> 
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionItem}>
          <MaterialCommunityIcons name="thumb-up-outline" size={16} style={{ marginRight: 4 }}/>
          <Text>Suka</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <MaterialCommunityIcons name="comment-outline" size={16} style={{ marginRight: 4 }}/>
          <Text>Komentar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <MaterialCommunityIcons name="share-variant" size={16} style={{ marginRight: 4 }}/>
          <Text>Bagikan</Text>
        </TouchableOpacity>
      </View>
    </Surface>
  );
}

export default MomentItem;