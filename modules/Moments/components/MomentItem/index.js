import React from "react";
import PeopleAPI from "src/api/people";
import MomentAPI from "modules/Moments/api/moment";
import Logger from "src/api/logger";
import { StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import SquareAvatar from "src/components/Avatar/Square";
import FastImage from "react-native-fast-image";
import LikeButton from "modules/Moments/components/MomentItem/LikeButton";
import { View, TouchableOpacity, FlatList } from "react-native";
import { Menu, Text, Surface, Caption } from "react-native-paper";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { default as momentDate } from "moment"

export function MomentImageThumbnail(props){
  const imageSize = Dimensions.get("window").width/3;
  const [isLoaded, setLoaded] = React.useState(false)
  const _isMounted = React.useRef(true);

  const handleLoadedImage =()=>{
    if(_isMounted.current) setLoaded(true)
  }

  React.useEffect(() => {

    return ()=> {
      _isMounted.current=false
    }
  }, [])

  const styles = StyleSheet.create({
    imageContainer: { display: "flex", alignItems: "stretch", flex: 1, height: imageSize },
    imageItem: { 
      margin: 4, borderRadius: 8, flex:1, aspectRatio: 1, height: "100%" }
  })
  return (
    <TouchableOpacity style={[ styles.imageContainer, props.style ]} onPress={props.onPress}>
        {(!isLoaded)?
          <ActivityIndicator style={{position: 'absolute',top: '40%',left:"40%"}} size="small" animating={true} color="#0EAD69"/>
        :<View/>}
      <FastImage style={[styles.imageItem,(!isLoaded)?{opacity: 0 } :{}]} source={props.source} resizeMode="cover" onLoad={handleLoadedImage}/>
    </TouchableOpacity>
  )
}

function MomentItem(props){
  const _isMounted = React.useRef(true);
  const [ moment, setMoment ] = React.useState(props.moment);
  const [ createdDate, setCreatedDate ] = React.useState("-");
  const [ people, setPeople ] = React.useState(null);
  const [ isMenuVisible, setIsMenuVisible ] = React.useState(false);
  
  const momentListener = React.useRef(null);
  const styles = StyleSheet.create({
    surface: { elevation: 16, padding: 16, display: "flex", flexDirection: "column", borderRadius: 4 },
    profile: { display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 8 },
    textContainer: { borderBottomColor: "#E8EEE8", borderBottomWidth: 1, paddingBottom: 8 }, 
    actionContainer: { display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingTop: 8 },
    actionItem: { display: "flex", flexDirection: "row", alignItems: "center", padding: 4 },
    imagesContainer: { display: "flex", flexDirection: "row", marginTop: 4, marginBottom: 4, flexGrow: 1 },
  })

  const toggleOpen = () => setIsMenuVisible(!isMenuVisible);
  const handleMenuClose = () => setIsMenuVisible(false);
  const handlePicturePress = (index) => {
    payload = {
      index,
      images: moment.content.images
    }
    props.navigation.navigate("GallerySwiper", payload);
  }

  const fetchPeople = async () => {
    const peopleData = await PeopleAPI.getDetail(moment.posterEmail)
    if(_isMounted.current)
      setPeople(peopleData);
  }

  const fetchMoment = async () => {
    momentListener.current = MomentAPI.getDetailWithRealTimeUpdate(moment.id, props.currentUser.email, (newMoment) => {
      if(newMoment.postTime){
       const creationDate = momentDate(newMoment.postTime.seconds * 1000).format("DD MMMM YYYY")
       const creationTime = momentDate(newMoment.postTime.seconds * 1000).format("HH:mm")
       setCreatedDate(creationDate+" | Jam "+ creationTime+" WIB")
      }
      if(_isMounted.current)
        setMoment(newMoment);
    })
  }

  const handleDeleteMomentPress = ()=> {
    handleMenuClose()
    props.onDeleteMomentPress()
  }

  React.useEffect(() => {

    fetchPeople();
    fetchMoment();
    return function cleanup(){
      _isMounted.current=false
      Logger.log("MomentItem.cleanup", `cleanup: ${moment.content.message}`);
      if(momentListener.current) momentListener.current();

    }
  }, [])

  
  try{
    
    if(people === null||!moment||!moment.content) return null;
      const imageSize = (Dimensions.get("window").width/3) + 10;
      let totalComments = ""
      if(moment.totalComments){
        if(moment.totalComments>=99){
          totalComments = "99+"
        }else{
          totalComments = moment.totalComments
        }
      }

    return (
      <Surface style={[ styles.surface, props.style ]}>
        <View style={{justifyContent: "space-between", flexDirection:"row"}}>
          <View style={styles.profile}>
            <SquareAvatar size={50} uri={people.profilePicture}/>
            <View style={{ marginLeft: 8 }}>
              <Text style={{ margin: 0, fontWeight: "bold" }}>{people.applicationInformation.nickName}</Text>
              <Caption style={{ margin: 0 }}>{createdDate}</Caption>
            </View>
          
          </View>
          {(people.email===props.currentUser.email)?  
          <Menu
            visible={isMenuVisible}
            onDismiss={handleMenuClose}
            anchor={<TouchableOpacity   onPress={toggleOpen}>
              <MaterialCommunityIcons name="dots-vertical" size={24} style={{padding:4}}/>
            </TouchableOpacity>}>
            <Menu.Item title="Delete Moment" onPress={handleDeleteMomentPress}/>
          </Menu>
          :
          <View/>
          }
        </View>
        <View style={styles.textContainer}>
          <Text style={{ textAlign: "justify" }}>{moment.content.message}</Text>
          {(moment.content.images.length>0)?
            <View style={{height: imageSize}}>
              <FlatList 
                style={styles.imagesContainer} 
                data={moment.content.images} 
                horizontal={true}
                keyExtractor={(item) => item.downloadUrl}
                renderItem={({ item, index }) => {
                  return <MomentImageThumbnail source={{ uri: item.downloadUrl }} onPress={() => handlePicturePress(index)}/>
                }}/> 
            </View>
            : <View/>}
        
        </View>
        <View style={styles.actionContainer}>
          <LikeButton style={{...styles.actionItem} } moment={moment} textColor={(moment.isLiked)? "#0ead69" : ""} />
          <TouchableOpacity style={styles.actionItem} onPress={props.onCommentPress}>
            <MaterialCommunityIcons name="comment-outline" size={16} style={{ marginRight: 4, color:(moment.isCommented)? "#0ead69" : "#000000" }}/>
            <Text style={{ color:(moment.isCommented)? "#0ead69" : "#000000" }}>{totalComments?`(${totalComments})`: ""} Komentar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={props.onSharePress}>
            <MaterialCommunityIcons name="share-variant" size={16} style={{ marginRight: 4 }}/>
            <Text>Bagikan</Text>
          </TouchableOpacity>
        </View>
      </Surface>
    );
  } catch{
    return null
  }
}

export default withCurrentUser(MomentItem);