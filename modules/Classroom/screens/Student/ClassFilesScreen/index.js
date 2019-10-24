import React from "react";
import { View, FlatList, StyleSheet, Platform } from "react-native";
import { ProgressBar, Text ,Dialog, Portal } from "react-native-paper";
import Permissions from "react-native-permissions";
import MySearchbar from "src/components/MySearchbar"
import FileListItem from "modules/Classroom/components/FileListItem";
import AppHeader from "src/components/AppHeader";
import FileAPI from "modules/Classroom/api/file";
import DeleteDialog from "src/components/DeleteDialog";
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";
import RNFetchBlob from 'react-native-fetch-blob'
import { withTranslation } from 'react-i18next';

const INITIAL_STATE = { 
  isRefreshing: true, 
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
      this.setState({ fileList: [], isRefreshing: true });
    const fileList = await FileAPI.getClassFiles(this.props.currentSchool.id, this.classId);
    if(this._isMounted)
      this.setState({ isRefreshing: false, fileList, filteredFileList: fileList  });
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

  handleRefresh = () => this.loadFiles()

  handleDeletePress = (item, selectedIndex) => {
    this.setState({selectedFile: item, selectedIndex})
    this.deleteDialog.toggleShow()
  }

  onDeletePress = async () => {
    this.setState({isRefreshing: true})
    await FileAPI.deleteClassFile(this.props.currentSchool.id,this.classId,this.state.selectedFile);
    this.deleteDialog.toggleShow()
    await this.loadFiles();
    this.setState({isRefreshing: false})
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

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.deleteDialog = null;
    this._isMounted = null
    this.classId = this.props.navigation.getParam("classId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.loadFiles = this.loadFiles.bind(this);
    this.handleDownloadPress = this.handleDownloadPress.bind(this);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.checkPermission = this.checkPermission.bind(this)
    this.handleSearchPress = this.handleSearchPress.bind(this);
    this.requestStoragePermission = this.requestStoragePermission.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);

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
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <AppHeader
            navigation={this.props.navigation}
            title={this.props.t("files")}
            style={{ backgroundColor: "white" }}
          />
        <View style={styles.subjectContainer}>
              <Text style={{fontWeight: "bold", fontSize: 18}}>
                {this.subject}
              </Text>
              <Text style={{fontSize: 18}}>
                {this.subjectDesc}
              </Text>
        </View>
        <View style={{marginTop: 16, marginHorizontal: 16 }}>
          <MySearchbar 
            onSubmitEditing={this.handleSearchPress}
            placeholder={this.props.t("searchFiles")} />
        </View>
        {(!this.state.isRefreshing && this.state.filteredFileList.length===0)?<Text style={{marginTop:16, textAlign:"center"}}>{this.props.t("listEmpty")}</Text>:null}
        <FlatList
          style={{ backgroundColor: "white", marginTop:16 }}
          data={this.state.filteredFileList}
          keyExtractor={(item) => item.id}
          refreshing={this.state.isRefreshing} 
          onRefresh={this.handleRefresh} 
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
                <Text>{this.props.t("downloadingFiles")}</Text>
                  <ProgressBar progress={this.state.progressPercentage} color="#EF6F6C" />
              </View>
            </Dialog.Content>
          </Dialog>
        </Portal>
        <DeleteDialog 
        ref ={i => this.deleteDialog = i}
        title={this.props.t("deleteFileAsk")}
        onDeletePress={this.onDeletePress}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subjectContainer:{
    marginTop: 8,
    backgroundColor: "#fff",
    flexDirection: "column",
    padding: 16
  },
  listItemContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  }
});
export default withTranslation()(withCurrentStudent(ClassFilesScreen))
