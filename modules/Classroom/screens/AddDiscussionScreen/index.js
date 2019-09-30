import React from "react";
import { FlatList, View, StyleSheet, PermissionsAndroid } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import TextInput from "src/components/TextInput";
import AppHeader from "src/components/AppHeader";
import Button from "src/components/Button";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import DiscussionAPI from "modules/Classroom/api/discussion";
import DocumentPicker from 'react-native-document-picker';
import StorageAPI from "src/api/storage"
import uuid from "uuid/v4"
import DeleteDialog from "src/components/DeleteDialog";
import ImageListItem from "src/components/ImageListItem"
import { withCurrentUser } from "src/api/people/CurrentUser"
import ImagePicker from 'react-native-image-picker';
import ImageCompress from "src/api/ImageCompress"

const INITIAL_STATE = {
  isLoading: false,
  title: "",
  description: "",
  imagesPicked: [],
  selectedImageToDelete: {},
  showDeleteImageDialog: false,
  locationCoordinate: null
};

class AddDiscussionScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  handleTitleChange = title => {
    this.setState({title})
  } 
  
  handleDescriptionChange = description => {
    this.setState({description})
  }

  handleSavePress = async () => {
    this.setState({ isLoading: true });
    const currentUserEmail = this.props.currentUser.email
    const data = {
      posterEmail: currentUserEmail,
      title: this.state.title,
      description: this.state.description,
      location: {...this.state.locationCoordinate},
      images: this.state.imagesPicked
    }
 
    await DiscussionAPI.addDiscussion(this.schoolId, this.classId, this.taskId, data);
    this.setState({ isLoading: false });
    const { navigation } = this.props;
    navigation.state.params.onRefresh(this.state.defaultValue);
    navigation.goBack();
  };

  handleLocationPress = () => {
    const payload = {
      latitude: (this.state.locationCoordinate)?this.state.locationCoordinate.latitude:"",
      longitude: (this.state.locationCoordinate)?this.state.locationCoordinate.longitude:"",
      onRefresh:(locationCoordinate)=> {
        this.setState({locationCoordinate})
        }
    }
    this.props.navigation.navigate("MapsPicker",payload)
  }

  handleSingleImagePress = async () => {
    if(!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE))){
      await this.requestStoragePermission()
      return
    }
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
    
      const downloadUrl = await StorageAPI.uploadFile("/modules/classroom/discussions/"+uuid(),res.uri)

    } catch (err) {
      console.log(err)
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }
  requestStoragePermission = async () => {
    try {
      await PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
      );
     
    } catch (err) {
      console.warn(err);
    }
  }
  handleCameraPress = async () => {
    if(!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE))){
      await this.requestStoragePermission()
      return
    }
   
    const options = {
      mediaType: 'photo',
    };
    ImagePicker.launchCamera(options, async (response) => {
      if(response.uri){
        const compressedRes = await ImageCompress.compress(response.uri, response.fileSize)
        let clonedImagesPicked = JSON.parse(JSON.stringify(this.state.imagesPicked))
        clonedImagesPicked.push({id: uuid(), ...compressedRes})
        this.setState({imagesPicked: clonedImagesPicked})
      }
    });
  }

  handleMultipleImagePress = async () => {
    if(!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE))){
      await this.requestStoragePermission()
      return
    }
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      let clonedImagesPicked = JSON.parse(JSON.stringify(this.state.imagesPicked))
      for (const res of results) {
        const compressedRes = await ImageCompress.compress(res.uri, res.size)

        clonedImagesPicked.push({id: uuid(), ...compressedRes})
      }
     
      this.setState({imagesPicked: clonedImagesPicked})
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  handleDeleteImagePress = (item) => {
    this.setState({selectedImageToDelete: item})
    this.deleteDialog.toggleShow()
  }

  onDeletePress = () => {
    
    const newselectedImageToDelete = this.state.imagesPicked.filter((image) => {
      return image.id!= this.state.selectedImageToDelete.id
    })
    this.setState({imagesPicked: []})
    this.setState({imagesPicked: newselectedImageToDelete})
    this.deleteDialog.toggleShow()
  }  

  constructor(props) {
    super(props);
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.state = INITIAL_STATE;
    this.handleSavePress = this.handleSavePress.bind(this);
    this.handleLocationPress = this.handleLocationPress.bind(this);
    this.handleSingleImagePress = this.handleSingleImagePress.bind(this);
    this.handleMultipleImagePress = this.handleMultipleImagePress.bind(this);
    this.handleDeleteImagePress = this.handleDeleteImagePress.bind(this);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.handleCameraPress = this.handleCameraPress.bind(this);
    this.requestStoragePermission = this.requestStoragePermission.bind(this);
    this.deleteDialog = null
  }

  render() {

    return (
      <View style={{ backgroundColor: "#E8EEE8" }}>
        <AppHeader
            navigation={this.props.navigation}
            title="Buat Diskusi Baru"
            style={{ backgroundColor: "white" }}
          />
        <ScrollView style={{ marginBottom:56}}>

          <View style={styles.subjectContainer}>
                <Text style={{fontWeight: "bold", fontSize: 18}}>
                  {this.subject}
                </Text>
                <Text style={{fontSize: 18}}>
                  {this.subjectDesc}
                </Text>
          </View>

          <View style={{ backgroundColor: "#fff" }}>
            <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
              <Text style={styles.label}>Topik Diskusi</Text>
              <TextInput
                style={{ marginTop: 16, backgroundColor: "#E8EEE8" }}
                value={this.state.title}
                onChangeText={this.handleTitleChange}
              />
            </View>
            
            <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
              <Text style={styles.label}>Deskripsi</Text>
              <TextInput
                style={{ marginTop: 16, backgroundColor: "#E8EEE8", textAlignVertical: "top" }}
                value={this.state.description}
                multiline={true}
                numberOfLines = {5}
                onChangeText={this.handleDescriptionChange}
              />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 16}}>
              <TouchableOpacity onPress={this.handleMultipleImagePress}>
                <EvilIcons name="image" size={32} style={{ color: "#5E8864",padding:8 }}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleCameraPress}>
                <EvilIcons name="camera" size={32} style={{ color: "#5E8864",padding:8 }}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleLocationPress} style={{flexDirection:"row"}} >
                <EvilIcons name="location" size={32} style={{ color: (this.state.locationCoordinate)?"#0EAD69":"#5E8864",padding: 8, }}/>
                <Text style={{alignSelf:"center", color:"#0EAD69"}}>{(this.state.locationCoordinate)?"Location attached.":""}</Text>
              </TouchableOpacity>
               
            </View>
            <FlatList
              numColumns={3}
              style={{ backgroundColor: "white" }}
              data={this.state.imagesPicked}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <ImageListItem 
                    onPress={() => this.handleDeleteImagePress(item)}
                    image={item}/>
                )
              }}
            />
          
            <View style={{ paddingVertical: 8 }} />
            <Button
              text="Buat Diskusi"
              isLoading={this.state.isLoading}
              onPress={this.handleSavePress}
              style={{marginHorizontal: 16}}
            />
          </View>
        </ScrollView>
        <DeleteDialog 
          ref ={i => this.deleteDialog = i}
          title= {"Apakah anda ingin menghapus gambar ini?"}
          onDeletePress={this.onDeletePress}/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  subjectContainer:{
    marginTop: 16,
    backgroundColor: "#fff",
    flexDirection: "column",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  profileContainer: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  listItemContainer: {
    backgroundColor: "#E8EEE8",
    flexDirection: "row",
    borderRadius: 8,
    padding: 16,
    paddingVertical: 12,
    alignItems: "center"
  },
  listDescriptionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  label: {
    fontWeight: "bold"
  }
});
export default withCurrentUser(AddDiscussionScreen)
