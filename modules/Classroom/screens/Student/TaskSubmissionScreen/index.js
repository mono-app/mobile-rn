import React from "react";
import { View, FlatList, PermissionsAndroid } from "react-native";
import { ProgressBar, Text, Dialog, Portal } from "react-native-paper";
import MySearchbar from "src/components/MySearchbar"
import FileListItem from "modules/Classroom/components/FileListItem";
import AppHeader from "src/components/AppHeader";
import FileAPI from "modules/Classroom/api/file";
import {  TouchableOpacity } from "react-native-gesture-handler";
import RNBackgroundDownloader from "react-native-background-downloader";
import DeleteDialog from "src/components/DeleteDialog";
import Icon from 'react-native-vector-icons/FontAwesome';
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";
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

class TaskSubmissionScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title={navigation.getParam("subject", "")}
          subtitle={navigation.getParam("subjectDesc", "")}
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadFiles = async () => {
    if(this._isMounted)
      this.setState({ fileList: [], isLoading: true });
    const currentUserEmail = this.props.currentStudent.email
    const fileList = await FileAPI.getStudentSubmissionFiles(this.props.currentSchool.id, this.classId, this.taskId, currentUserEmail);
    if(this._isMounted)
      this.setState({ isLoading: false, fileList, filteredFileList: fileList  });
  }

  handleDownloadPress = async item => {
    if(!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE))){
      await this.requestStoragePermission()
    }else{
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
        console.log('progress', received / total)
        const percentage = received / total*100
        this.setState({progressPercentage: percentage})
      })
      .then((resp) => {
        // the path of downloaded file
        // console.log(resp.path())
        this.setState({showProgressbar:false})
      }).catch((errorMessage, statusCode) => {
        // error handling
        
      })
    }
  }

  handleDeletePress = (item, selectedIndex) => {
    this.setState({selectedFile: item, selectedIndex})
    this.deleteDialog.toggleShow()
  }

  onDeletePress = async () => {
    this.setState({isLoading: true})
    const currentUserEmail = this.props.currentStudent.email

    await FileAPI.deleteStudentSubmissionFile(this.props.currentSchool.id,this.classId,this.taskId,currentUserEmail, this.state.selectedFile);
    this.deleteDialog.toggleShow()
    await this.loadFiles();
    this.setState({isLoading: false})
  }

  handleAddFiles = () => {
    this.props.navigation.navigate("AddTaskSubmission")
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
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.deleteDialog = null;
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.loadFiles = this.loadFiles.bind(this);
    this.handleDownloadPress = this.handleDownloadPress.bind(this);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
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
      <View style={{ flex: 1, backgroundColor: "#E8EEE8", paddingBottom:16 }}>
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
               TAMBAH FILE TUGAS
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ backgroundColor: "white" }}
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
export default withCurrentStudent(TaskSubmissionScreen)
