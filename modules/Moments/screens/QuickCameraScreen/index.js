import React from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { StackActions, NavigationActions } from 'react-navigation';

export default class QuickCameraScreen extends React.PureComponent {
  
  takePicture = async() => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      const { navigation } = this.props;
      const payload = {
        cameraPic: data
      }
      
    const resetAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'Home' }),
        NavigationActions.navigate({ routeName: 'AddMoment', params: payload })
      ],
    });

      navigation.dispatch(resetAction);
    }
  };

  constructor(props){
    super(props)
    this.takePicture = this.takePicture.bind(this)
    this.camera = null
  }
  
  
  
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
