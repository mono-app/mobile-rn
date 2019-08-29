import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import React from "react";
import {StyleSheet, Dimensions, View} from "react-native"
import Button from "src/components/Button";

const INITIAL_STATE = { 
  initialRegion: { 
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,},
  markers: []
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

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE    
    this.handleOnPointClick = this.handleOnPointClick.bind(this)
    this.handleSavePress = this.handleSavePress.bind(this)
  }

  componentDidMount(){

  }

  render() {  
    return (
      <View style={{flex:1}}>
        
        <MapView style={styles.container}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }} onPress={(e) => this.handleOnPointClick(e.nativeEvent)}>
            {this.state.markers.map(marker => (
              <Marker coordinate={marker.coordinate} />
            ))}
        </MapView>
        <Button
              style={{margin: 16}}
              text="Ambil Lokasi"
              onPress={this.handleSavePress}
            />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})