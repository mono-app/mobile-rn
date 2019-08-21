import React from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import TextInput from "src/components/TextInput";
import AppHeader from "src/components/AppHeader";
import Button from "src/components/Button";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import CurrentUserAPI from "src/api/people/CurrentUser";
import DiscussionAPI from "modules/Classroom/api/discussion";
import DocumentPicker from 'react-native-document-picker';
import StorageAPI from "src/api/storage"
import uuid from "uuid/v4"
import FastImage from "react-native-fast-image";
import DeleteDialog from "src/components/DeleteDialog";

const INITIAL_STATE = {
  isLoading: false,
  title: "",
  description: "",
  imagesPicked: [],
  selectedImageToDelete: {},
  showDeleteImageDialog: false,
  locationCoordinate: null
};

/**
 * Parameter list
 *
 * @param {string} classId
 */
export default class AddDiscussionScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Buat Diskusi Baru"
          style={{ backgroundColor: "transparent" }}
        />
      )
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
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail()
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
      onRefresh:(locationCoordinate)=> {
        this.setState({locationCoordinate})
        console.log(locationCoordinate)
        }
    }
    this.props.navigation.navigate("MapsPicker",payload)
  }

  handleSingleImagePress = async () => {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
    
      const downloadUrl = await StorageAPI.uploadFile("/modules/classroom/discussions/"+uuid(),res.uri)

      console.log(downloadUrl)

    } catch (err) {
      console.log(err)
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  handleCameraPress = () => {
    const payload = {
      onRefresh:(image)=> {
          let clonedImagesPicked = JSON.parse(JSON.stringify(this.state.imagesPicked))
          clonedImagesPicked.push(image)
          console.log(clonedImagesPicked)
          this.setState({imagesPicked: clonedImagesPicked})
        }
    }
    this.props.navigation.navigate("Camera",payload)
  }

  handleMultipleImagePress = async () => {
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      let clonedImagesPicked = JSON.parse(JSON.stringify(this.state.imagesPicked))
      for (const res of results) {
        clonedImagesPicked.push(res)
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
    console.log(item)
    this.setState({selectedImageToDelete: item})
    this.deleteDialog.toggleShow()
  }

  onDeletePress = () => {
    const newselectedImageToDelete = this.state.imagesPicked.filter((image) => {
      return image.uri!= this.state.selectedImageToDelete.uri
    })
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
    this.deleteDialog = null
  }

  render() {
    const window = Dimensions.get("window");

    return (
      <View style={{ backgroundColor: "#E8EEE8" }}>
        <ScrollView>

          <View style={styles.subjectContainer}>
                <Text style={{fontWeight: "bold", fontSize: 18}}>
                  {this.subject}
                </Text>
                <Text style={{fontSize: 18}}>
                  {this.subjectDesc}
                </Text>
          </View>

          <View style={{ padding: 16, backgroundColor: "#fff" }}>
            <View style={{ marginTop: 16 }}>
              <Text style={styles.label}>Topik Diskusi</Text>
              <TextInput
                style={{ marginTop: 16, backgroundColor: "#E8EEE8" }}
                value={this.state.title}
                onChangeText={this.handleTitleChange}
              />
            </View>
            
            <View style={{ marginTop: 16 }}>
              <Text style={styles.label}>Deskripsi</Text>
              <TextInput
                style={{ marginTop: 16, backgroundColor: "#E8EEE8", textAlignVertical: "top" }}
                value={this.state.description}
                multiline={true}
                numberOfLines = {5}
                onChangeText={this.handleDescriptionChange}
              />
              <Text style={styles.label}>{(this.state.locationCoordinate)?this.state.locationCoordinate.latitude:""}</Text>
            </View>

            { (this.state.imagesPicked && this.state.imagesPicked.length) > 0?(
              <View style={{ flex: 1, flexDirection: "row", flexWrap:"wrap", marginHorizontal: 8 }}>
                  {this.state.imagesPicked.map((item, index) => {
                      return (
                        <TouchableOpacity onPress={() => this.handleDeleteImagePress(item)} key={index} style={{ height: (window.width/4), width: (window.width/4), padding:4 }}>
                          <FastImage 
                            resizeMode="cover"
                            source={{ uri: item.uri  }} 
                            style={{ alignSelf: "stretch", flex: 1 }}/>
                        </TouchableOpacity>
                      )
                  })}
              </View>

            ):<View/>}

            <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop:8}}>
              <TouchableOpacity onPress={this.handleMultipleImagePress}>
                <EvilIcons name="image" size={24} style={{ color: "#5E8864",padding:8 }}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleCameraPress}>
                <EvilIcons name="camera" size={24} style={{ color: "#5E8864",padding:8 }}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleLocationPress}>
                <EvilIcons name="location" size={24} style={{ color: "#5E8864",padding:8 }}/>
              </TouchableOpacity>
               
            </View>
            <View style={{ paddingVertical: 8 }} />
            <Button
              text="Buat Diskusi"
              isLoading={this.state.isLoading}
              onPress={this.handleSavePress}
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
