import React from "react";
import { View, FlatList, StyleSheet, PermissionsAndroid } from "react-native";
import { ProgressBar, Text ,Dialog, Portal } from "react-native-paper";
import MySearchbar from "src/components/MySearchbar"
import FileListItem from "modules/Classroom/components/FileListItem";
import AppHeader from "src/components/AppHeader";
import FileAPI from "modules/Classroom/api/file";
import RNBackgroundDownloader from "react-native-background-downloader";
import DeleteDialog from "src/components/DeleteDialog";
import { withCurrentStudent } from "modules/Classroom/api/student/CurrentStudent";

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
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Berkas"
          style={{ backgroundColor: "transparent" }}
        />
      )
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
    if(!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE))){
      await this.requestStoragePermission()
    }else{
      this.setState({progressPercentage:0,showProgressbar: true})
      RNBackgroundDownloader.download({
          id: item.id,
          url: item.storage.downloadUrl,
          destination: `/storage/emulated/0/Download/${item.title}`
      }).begin((expectedBytes) => {
          console.log(`Going to download ${expectedBytes} bytes!`);
  
      }).progress((percent) => {
          console.log(`Downloaded: ${percent * 100}%`);
          this.setState({progressPercentage: percent})
      }).done(() => {
          console.log('Download is done!');
          this.setState({showProgressbar:false})
      }).error((error) => {
          console.log('Download canceled due to error: ', error);
      });
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
            placeholder="Cari Berkas" />
        </View>
      
        <FlatList
          style={{ backgroundColor: "white", marginTop:16 }}
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
export default withCurrentStudent(ClassFilesScreen)
