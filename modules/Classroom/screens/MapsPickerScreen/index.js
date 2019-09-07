import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import React from "react";
import {StyleSheet, Dimensions, View} from "react-native"
import Button from "src/components/Button";
import RNGooglePlaces from 'react-native-google-places';
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome5';

const INITIAL_STATE = { 
  latitude: {},
  longitude: {},
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
  markers: [],
  place: {},
  marginBottom: 1
};

export default class MapsPickerScreen extends React.PureComponent {
  
  handleOnPointClick = (poi) => {
    const coordinate = poi.coordinate
    const markers = [{coordinate}]
    this.setState({markers})
  }

  handleSavePress = ()=> {
    if(this.state.markers.length>0){
      const { navigation } = this.props;
      navigation.state.params.onRefresh(this.state.markers[0].coordinate);
      navigation.goBack();
    }
  }
  
  handleOpenSerachModal = () => {

    RNGooglePlaces.openAutocompleteModal({
          initialQuery: '', 
          locationRestriction: {
              latitudeSW: -8.705031, 
              longitudeSW: 94.647071, 
              latitudeNE: 4.886661, 
              longitudeNE: 142.220608
          },
          country: 'ID',
          type: 'establishment'
      }, ['placeID', 'location', 'name', 'address', 'types', 'openingHours', 'plusCode', 'rating', 'userRatingsTotal', 'viewport']
    )
    .then((place) => {
      const coordinate = place.location
      const markers = [{coordinate}]

      this.setState({markers, place, latitude: place.location.latitude, longitude: place.location.longitude})
      this.mapRef.animateToRegion(
        {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        },
        1000
      );
    })
    .catch(error => console.log(error.message));
  }

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      // Create the object to update this.state.mapRegion through the onRegionChange function
     
       const coordinate = {longitude: position.coords.longitude, latitude: position.coords.latitude}
      // const markers = [{coordinate}]
      // this.setState({markers})
      this.mapRef.animateToRegion(
        {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        },
        1000
      );
    }, (error)=>console.log(error));
    
  }

  handleOnMapReady =()=>{
    if(!this.props.navigation.getParam("longitude","")){
      this.getCurrentLocation()
    }
  }

  constructor(props) {
    super(props);
    INITIAL_STATE.longitude = (props.navigation.getParam("longitude",""))?props.navigation.getParam("longitude", -122.4324):-122.4324;
    INITIAL_STATE.latitude =  (props.navigation.getParam("latitude",""))?props.navigation.getParam("latitude", 37.78825):-122.4324;
    this.state = INITIAL_STATE    
    this.handleOnPointClick = this.handleOnPointClick.bind(this)
    this.handleSavePress = this.handleSavePress.bind(this)
    this.handleOpenSerachModal = this.handleOpenSerachModal.bind(this)
    this.getCurrentLocation = this.getCurrentLocation.bind(this)
    this.handleOnMapReady = this.handleOnMapReady.bind(this)
    this.mapRef = null;

  }

  componentDidMount(){
    if(this.props.navigation.getParam("longitude","")){
      const coordinate = {longitude: this.state.longitude, latitude: this.state.latitude}
      const markers = [{coordinate}]
      this.setState({markers})
    }
  }

  render() {  
    return (
      <View style={{flex:1}}>
        
        <MapView style={{...styles.container,marginBottom: this.state.marginBottom}}
          ref={(ref) => { this.mapRef = ref }}
          onMapReady={this.handleOnMapReady}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta,
          }} 
          
          onPress={(e) => this.handleOnPointClick(e.nativeEvent)}>
            {this.state.markers.map(marker => (
              <Marker key={0} coordinate={marker.coordinate} />
            ))}
        </MapView>
        <View style={{flex: 1, justifyContent: 'flex-start'}}  keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleOpenSerachModal}>
              <Text style={{margin:16, padding:16, backgroundColor: "#fff", borderRadius: 16 }}>{(this.state.place.address)?this.state.place.address:"Cari Lokasi"}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1,
              flexDirection:"column",
              justifyContent: 'flex-end'}}>
          <TouchableOpacity onPress={this.getCurrentLocation}>
            <Icon name="location-arrow" size={16} color="#000" style={{padding:8, backgroundColor:"#fff",margin:16,alignSelf:"flex-end"}}/> 
          </TouchableOpacity>
          
          <Button
            style={{margin:16}}
            text="Ambil Lokasi"
            onPress={this.handleSavePress}
          />
        </View>
   
      </View>
    );
    // return (
    //   <View style={styles.container}>
    //     <TouchableOpacity
    //       style={styles.button}
    //       onPress={() => this.openSearchModal()}
    //     >
    //       <Text>Pick a Place</Text>
    //     </TouchableOpacity>
    //   </View>
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})