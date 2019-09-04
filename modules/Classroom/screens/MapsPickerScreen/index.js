import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import React from "react";
import {StyleSheet, Dimensions, View} from "react-native"
import Button from "src/components/Button";
import RNGooglePlaces from 'react-native-google-places';
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import TextInput from "src/components/TextInput";

const INITIAL_STATE = { 
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
  markers: [],
  place: {}
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
          initialQuery: 'vestar', 
          locationRestriction: {
              latitudeSW: 6.3670553, 
              longitudeSW: 2.7062895, 
              latitudeNE: 6.6967964, 
              longitudeNE: 4.351055
          },
          country: 'NG',
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

  constructor(props) {
    super(props);
    INITIAL_STATE.longitude = (props.navigation.getParam("longitude",""))?props.navigation.getParam("longitude", -122.4324):-122.4324;
    INITIAL_STATE.latitude =  (props.navigation.getParam("latitude",""))?props.navigation.getParam("latitude", 37.78825):-122.4324;
    this.state = INITIAL_STATE    
    this.handleOnPointClick = this.handleOnPointClick.bind(this)
    this.handleSavePress = this.handleSavePress.bind(this)
    this.handleOpenSerachModal = this.handleOpenSerachModal.bind(this)
    this.mapRef = null;

  }

  componentDidMount(){
    if(this.props.navigation.getParam("longitude","")){
      const coordinate = {longitude: this.state.longitude,latitude:this.state.latitude}
      const markers = [{coordinate}]
      this.setState({markers})
    }
    
  }


  render() {  
    return (
      <View style={{flex:1}}>
        
        <MapView style={styles.container}
          ref={(ref) => { this.mapRef = ref }}
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
                justifyContent: 'flex-end'}}>
                
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