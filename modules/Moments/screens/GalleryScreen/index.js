import React from "react";
import { TouchableOpacity, FlatList, View, Image, Dimensions, Picker, CameraRoll } from "react-native";
import { Surface, withTheme, Snackbar } from "react-native-paper";
import { NavigationEvents } from "react-navigation";
import { CameraKitGallery } from "react-native-camera-kit";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";

const INITIAL_STATE = { isPermitted: false, albums: {}, albumNames: [], selectedAlbum: null, selectedImages: [] }

class GalleryScreen extends React.Component{
  static navigationOptions = { headerTitle: "Pilih Foto" }

  formatData = (data, numColumns) => {
    if(data === undefined)  return [];
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementLastRow = data.length - (numberOfFullRows * numColumns);
    while(numberOfElementLastRow !== numColumns && numberOfElementLastRow !== 0){
      data.push({ empty: true });
      numberOfElementLastRow += 1;
    }
    return data;
  }

  handleAlbumChange = selectedAlbum=> this.setState({ selectedAlbum });
  handleScreenDidFocus = () => {
    CameraKitGallery.requestDevicePhotosAuthorization().then(success => {
      if(!success) this.props.navigation.goBack();
      else return CameraRoll.getPhotos({ first: 9999,  assetType: "Photos" });
    }).then(result => {
      let albums = {};
      result.edges.forEach(({ node }) => {
        if(albums[node.group_name] === undefined) albums[node.group_name] = [];
        albums[node.group_name].push(node);
      })
      const albumNames = Object.keys(albums).sort();
      const selectedAlbum = albumNames.includes("Camera")?"Camera": albumNames[0];
      this.setState({ albums, albumNames, selectedAlbum });
    })
  }

  handleToggleImageSelect = (itemIndex, item) => {
    const { albums, selectedAlbum, selectedImages } = this.state;
    item.selected = (item.selected === undefined || item.selected === false)? true: false;
    albums[selectedAlbum][itemIndex] = item;

    let newSelectedImages;
    if(item.selected) newSelectedImages = [ ...selectedImages, item ];
    else newSelectedImages = selectedImages.filter(a => a.image.uri !== item.image.uri);

    this.setState({ albums, selectedImages: newSelectedImages });
  }

  handleSubmitImages = () => {
    const onComplete = this.props.navigation.getParam("onComplete");
    if(onComplete) onComplete(this.state.selectedImages);
    this.props.navigation.goBack();
  }


  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.formatData = this.formatData.bind(this);
    this.handleScreenDidFocus = this.handleScreenDidFocus.bind(this);
    this.handleAlbumChange = this.handleAlbumChange.bind(this);
    this.handleToggleImageSelect = this.handleToggleImageSelect.bind(this);
    this.handleSubmitImages = this.handleSubmitImages.bind(this);
  }

  render(){
    const { colors } = this.props.theme;
    return(
      <View style={{ flex: 1 }}>
        <NavigationEvents onDidFocus={this.handleScreenDidFocus}/>

        <Surface style={{ marginHorizontal: 16, elevation: 4 }}>
          <Picker
            selectedValue={this.state.selectedAlbum}
            style={{ marginHorizontal: 16 }}
            onValueChange={this.handleAlbumChange}>
            {this.state.albumNames.map((albumName, index) => <Picker.Item label={albumName} value={albumName}/>)}
          </Picker>
        </Surface>

        <FlatList
          style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 0, marginVertical: 16  }}
          data={this.formatData(this.state.albums[this.state.selectedAlbum], 3)}
          extraData={this.state}
          numColumns={3}
          renderItem={({ item, index }) => {
            const height = Dimensions.get('window').width / 3;
            if(item.empty !== undefined) return <View style={{ flex: 1, height, padding: 2 }}/>
            return(              
              <TouchableOpacity onPress={() => this.handleToggleImageSelect(index, item)} style={{ position: "relative", flex: 1, height, padding: 2 }}>
                <Image resizeMode="cover" style={{ height: "100%" }}  source={{ uri: item.image.uri }}/>
                {(item.selected === true)?(
                    <View style={{ position: "absolute", top: 2, left: 2, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, .52)"}}>
                      <MaterialIcons style={{ position: "absolute", right: 4, top: 6 }} name="check-circle" size={24} color={colors.primary}/>
                    </View>
                ):<View/>}
              </TouchableOpacity>
            )
          }}/>

          <Snackbar
            visible={(this.state.selectedImages.length !== 0)}
            onDismiss={() => {}}
            action={{ label: "Siapkan", onPress: this.handleSubmitImages }}>
            {this.state.selectedImages.length} foto terpilih
          </Snackbar>
      </View>
    )
  }
}

export default withTheme(GalleryScreen);