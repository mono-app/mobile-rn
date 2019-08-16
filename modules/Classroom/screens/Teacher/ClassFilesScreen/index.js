import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { ProgressBar,Caption,Searchbar,Text,Dialog,Portal } from "react-native-paper";
import FileListItem from "../../../components/FileListItem";
import AppHeader from "src/components/AppHeader";
import FileAPI from "../../../api/file";
import {  TouchableOpacity } from "react-native-gesture-handler";
import RNBackgroundDownloader from "react-native-background-downloader";
import DeleteDialog from "src/components/DeleteDialog";

const INITIAL_STATE = { 
  isLoading: true, 
  progressPercentage: 0, 
  showProgressbar: false, 
  isDeleting: false, 
  selectedFile: null, 
  selectedIndex: -1,
  searchText: "", 
  fileList:[], 
  filteredFileList:[]  
};

export default class ClassFilesScreen extends React.PureComponent {
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
    this.setState({ fileList: [], isLoading: true });
    const fileList = await FileAPI.getClassFiles(this.schoolId, this.classId);
    this.setState({ isLoading: false, fileList, filteredFileList: fileList  });
  }

  handleDownloadPress = item => {
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

  handleDeletePress = (item, selectedIndex) => {
    this.setState({selectedFile: item, selectedIndex})
    this.deleteDialog.toggleShow()
  }

  onDeletePress = async () => {
    this.setState({isLoading: true})
    await FileAPI.deleteClassFile(this.schoolId,this.classId,this.state.selectedFile);
    this.deleteDialog.toggleShow()
    await this.loadFiles();
    this.setState({isLoading: false})
  }

  handleAddFiles = () => {
    payload = {
      schoolId: this.schoolId
    }
    this.props.navigation.navigate("AddClassFiles", payload)
  }

  handleSearchPress = () => {
    this.setState({filteredFileList: []})

    const clonedFileList = JSON.parse(JSON.stringify(this.state.fileList))
    const newSearchText = JSON.parse(JSON.stringify(this.state.searchText)) 
    if(this.state.searchText){
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
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.deleteDialog = null;
    this.loadFiles = this.loadFiles.bind(this);
    this.handleDownloadPress = this.handleDownloadPress.bind(this);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);
  }

  componentDidMount(){
    this.loadFiles();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8", paddingBottom:16 }}>
        <View style={{margin: 16 }}>
          <Searchbar 
            onChangeText={searchText => {this.setState({searchText})}}
            onSubmitEditing={this.handleSearchPress}
            value={this.state.searchText}
            placeholder="Cari Berkas" />
        </View>
        <View style={{backgroundColor: "#DCDCDC",
                      padding: 16}}>
          <TouchableOpacity onPress={this.handleAddFiles}>
            <Text style={{fontWeight:"bold"}}>
              + Tambahkan Berkas Lainnya
            </Text>
          </TouchableOpacity>
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