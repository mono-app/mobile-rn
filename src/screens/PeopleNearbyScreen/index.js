import React from "react";
import FriendsAPI from "src/api/friends";
import PeopleAPI from "src/api/people";
import { withCurrentUser } from "src/api/people/CurrentUser";
import PeopleListItem from "src/components/PeopleListItem";
import HeadlineTitle from "src/components/HeadlineTitle";
import AppHeader from "src/components/AppHeader";
import { View, FlatList, Platform } from "react-native";
import Permissions from "react-native-permissions";
import Geolocation from 'react-native-geolocation-service';
import geohash from 'ngeohash'

function PeopleNearbyScreen(props){
  const { currentUser } = props;
  const [ isPermissionGranted, setPermissionGranted ] = React.useState([false]);
  const [ peopleList, setPeopleList ] = React.useState([]);
  const friendsListener = React.useRef(null);

  const handleContactPress = (people) => {
    props.navigation.navigate("PeopleInformation", { peopleEmail: people.email });
  }

  const checkPermission = async () => {
    let permissionResponse;
    if(Platform.OS === "android"){
      permissionResponse = await Permissions.check("location");
    }else if(Platform.OS === "ios"){
      permissionResponse = await Permissions.check("location");
    }

    if(permissionResponse === "authorized") return true;
    else return false;
  }
  
  const requestPermission = async () => {
    try{
      let permissionResponse;
      if(Platform.OS === "android"){
        permissionResponse = await Permissions.request("location");
      }else if(Platform.OS === "ios"){
        permissionResponse = await Permissions.request("location");
      }

      if(permissionResponse === "authorized"){
        // do something if authorized
        setPermissionGranted(true)
      }else{
        // do something if unauthorized
      }
    }catch(err){

    }
  }
  
  const storeCurrentLocation = () =>{
    Geolocation.getCurrentPosition(
        (position) => {
            PeopleAPI.updateCurrentLocation(props.currentUser.email,position)
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude

            getNearbyPeople(latitude, longitude)
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  const getNearbyPeople = async (latitude, longitude) => {
    const peoples = await PeopleAPI.getNearbyPeoples(props.currentUser.email, latitude,longitude,25000)
    setPeopleList(peoples);

  }

  React.useEffect(() => {
    const init = async() => {
      const result = await checkPermission()
      setPermissionGranted(result)
      if(!result){
        await requestPermission();
        return;
      }
      storeCurrentLocation()
    
    }
    init()

    return function cleanup(){
    }
  }, [isPermissionGranted])
  
  return(
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AppHeader style={{ backgroundColor: "transparent" }} navigation={props.navigation}/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16 }}>Sekitar Saya</HeadlineTitle>
      <FlatList
        style={{ backgroundColor: "white" }}
        data={peopleList}
        keyExtractor={(item) => item.email}
        renderItem={({ item, index }) => {
          const distance = (item.distance)? item.distance: 0
          return <PeopleListItem key={index} people={item} distance={distance} onPress={handleContactPress}/>
        }}/>
    </View>
  )
}
PeopleNearbyScreen.navigationOptions = { header: null }
export default withCurrentUser(PeopleNearbyScreen);