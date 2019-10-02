import React from "react";
import { View, FlatList, Platform } from "react-native";
import Permissions from "react-native-permissions";
import { ProgressBar, Text, Dialog, Portal } from "react-native-paper";
import MySearchbar from "src/components/MySearchbar"
import Icon from 'react-native-vector-icons/FontAwesome';
import FileListItem from "modules/Classroom/components/FileListItem";
import AppHeader from "src/components/AppHeader";
import FileAPI from "modules/Classroom/api/file";
import { TouchableOpacity } from "react-native-gesture-handler";
import DeleteDialog from "src/components/DeleteDialog";
import { withCurrentTeacher } from "modules/Classroom/api/teacher/CurrentTeacher";
import RNFetchBlob from 'react-native-fetch-blob'

const INITIAL_STATE = { 
  isLoading: true, 
  progressPercentage: 0, 
  showProgressbar: false, 
  isDeleting: false, 
  selectedFile: null, 
  selectedIndex: -1,
  fileList:[], 
  filteredFileList:[]  
};

class ClassFilesScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  loadFiles = async () => {
    if(this._isMounted)
      this.setState({ fileList: [], isLoading: true });
    const fileList = await FileAPI.getClassFiles(this.props.currentSchool.id, this.classId);
    if(this._isMounted)
      this.setState({ isLoading: false, fileList, filteredFileList: fileList  });
  }

  handleDownloadPress = async item => {
    const isPermissionGranted = await this.checkPermission();
    if(!isPermissionGranted){
      await this.requestStoragePermission();
      return;
    }

    this.setState({progressPercentage:0,showProgressbar: true})
    RNFetchBlob.config({
      fileCache : true,
      // android only options, these options be a no-op on IOS
      addAndroidDownloads : {
        // Show notification when response data transmitted
        useDownloadManager : true,
        // Title of download notification
        title : item.title,
        // Make the file scannable  by media scanner
        mediaScannable : true,
        notification : true,
        path : `/storage/emulated/0/Download/${item.title}`
      }
    })
    .fetch('GET', item.storage.downloadUrl)
    .progress((received, total) => {
      const percentage = received / total*100
      this.setState({progressPercentage: percentage})
    })
    .then((resp) => {
      // the path of downloaded file
      this.setState({showProgressbar:false})
    }).catch((errorMessage, statusCode) => {
      // error handling
      
    })
    
  }

  handleDeletePress = (item, selectedIndex) => {
    this.setState({selectedFile: item, selectedIndex})
    this.deleteDialog.toggleShow()
  }

  onDeletePress = async () => {
    this.setState({isLoading: true})
    await FileAPI.deleteClassFile(this.props.currentSchool.id,this.classId,this.state.selectedFile);
    this.deleteDialog.toggleShow()
    await this.loadFiles();
    this.setState({isLoading: false})
  }

  handleAddFiles = () => {
    
    this.props.navigation.navigate("AddClassFiles")
  }

  handleSearchPress = (searchText) => {
    this.setState({filteredFileList: []})

    const clonedFileList = JSON.parse(JSON.stringify(this.state.fileList))
    const newSearchText = JSON.parse(JSON.stringify(searchText)) 
    if(searchText){
      const filteredFileList = clonedFileList.filter((file) => {
        return file.title.toLowerCase().indexOf(newSearchText.toLowerCase()) >= 0
      })
      this.setState({filteredFileList})
    } else {
      this.setState({filteredFileList: clonedFileList})
    }
  }

  checkPermission = async () => {
    let permissionResponse;
    if(Platform.OS === "android"){
      permissionResponse = await Permissions.check("storage");
    }else if(Platform.OS === "ios"){
      permissionResponse = await Permissions.check("photo");
    }

    if(permissionResponse === "authorized") return true;
    else return false;
  }
  
  requestStoragePermission = async () => {
    try{
      let permissionResponse;
      if(Platform.OS === "android"){
        permissionResponse = await Permissions.request("storage");
      }else if(Platform.OS === "ios"){
        permissionResponse = await Permissions.request("photo");
      }

      if(permissionResponse === "authorized"){
        // do something if authorized
      }else{
        // do something if unauthorized
      }
    }catch(err){

    }
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.classId = this.props.navigation.getParam("classId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.deleteDialog = null;
    this.loadFiles = this.loadFiles.bind(this);
    this.handleDownloadPress = this.handleDownloadPress.bind(this);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
    this.checkPermission = this.checkPermission.bind(this)
    this.requestStoragePermission = this.requestStoragePermission.bind(this);
  }

  componentDidMount(){
    this._isMounted = true
    this.loadFiles();
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <AppHeader
          navigation={this.props.navigation}
          title={this.props.navigation.getParam("subject", "")}
          subtitle={this.props.navigation.getParam("subjectDesc", "")}
          style={{ backgroundColor: "white" }}
        />
        <View style={{margin: 16 }}>
          <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
            placeholder="Cari Berkas" />
        </View>
        <View style={{backgroundColor: "#0ead69",
                      padding: 16}}>
          <TouchableOpacity onPress={this.handleAddFiles} style={{ display:"flex", flexDirection:"row",alignItems:"center"}}>
          <Icon name="plus" size={16} color="#fff" style={{marginTop: 2, marginRight: 4}}/> 
            <Text style={{fontWeight:"bold", color:"#fff"}}>
               TAMBAH ARSIP KELAS
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ backgroundColor: "white", marginVertical:16 }}
          data={this.state.filteredFileList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <FileListItem 
                onDownloadPress={() => this.handleDownloadPress(item)}
                onDeletePress={() => this.handleDeletePress(item, index)}
                file={item} />
            )
          }}
        />
        <Portal>
          <Dialog visible={this.state.showProgressbar}>
            <Dialog.Content
              style={{ flexDirection: "row", justifyContent: "space-evenly" }}
            >
              <View>
                <Text>Mendownload Berkas</Text>
                  <ProgressBar progress={this.state.progressPercentage} color="red" />
              </View>
            </Dialog.Content>
          </Dialog>
        </Portal>
        <DeleteDialog 
        ref ={i => this.deleteDialog = i}
        title= {"Apakah anda ingin menghapus berkas ini?"}
        onDeletePress={this.onDeletePress}/>
      </View>
    );
  }
}
export default withCurrentTeacher(ClassFilesScreen)
