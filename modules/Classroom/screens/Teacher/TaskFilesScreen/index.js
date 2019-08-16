import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import {
  ProgressBar,
  Searchbar,
  Text,
  Dialog,
  Portal
} from "react-native-paper";
import FileListItem from "../../../components/FileListItem";
import AppHeader from "src/components/AppHeader";
import FileAPI from "../../../api/file";
import RNBackgroundDownloader from "react-native-background-downloader";
import DeleteDialog from "src/components/DeleteDialog";
import Button from "src/components/Button";

const INITIAL_STATE = {
  isLoading: true,
  isDownloadAllLoading: false,
  progressPercentage: 0,
  showProgressbar: false,
  isDeleting: false,
  selectedFile: null,
  selectedIndex: -1,
  totalDownloadedItem: 0,
  totalItemToDownload: 1,
  searchText: "", 
  fileList:[], 
  filteredFileList:[]  
};

export default class TaskFilesScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Tugas"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadFiles = async () => {
    this.setState({ fileList: [], isLoading: true });

    const fileList = await FileAPI.getStudentSubmissionFiles(
      this.schoolId,
      this.classId,
      this.taskId,
      this.submissionId
    );
    this.setState({ isLoading: false, fileList, filteredFileList: fileList  });
  };

  handleDownloadPress = item => {
    this.setState({ progressPercentage: 0,totalDownloadedItem: 0,totalItemToDownload:1 , showProgressbar: true });
    this.doDownload(item)
  };

  doDownload = (item)=>{
    RNBackgroundDownloader.download({
      id: item.id,
      url: item.downloadUrl,
      destination: `/storage/emulated/0/Download/${item.title}`
    })
      .begin(expectedBytes => {
        console.log(`Going to download ${expectedBytes} bytes!`);
      })
      .progress(percent => {
        console.log(`Downloaded: ${percent * 100}%`);
        if(this.state.totalItemToDownload==1){
          this.setState({ progressPercentage: percent});
        }
      })
      .done(() => {
        console.log("Download is done!");
        let clonedTotalDownloadedItem = JSON.parse(JSON.stringify(this.state.totalDownloadedItem))
        clonedTotalDownloadedItem += 1
        if(this.state.totalItemToDownload>1){
          this.setState({ progressPercentage: (clonedTotalDownloadedItem/this.state.totalItemToDownload), totalDownloadedItem:clonedTotalDownloadedItem});
        }
        
        if(clonedTotalDownloadedItem===this.state.totalItemToDownload){
          this.setState({ showProgressbar: false});
        }
      })
      .error(error => {
        console.log("Download canceled due to error: ", error);
      });
  }

  handleDownloadAll = () => {
    if(this.state.filteredFileList.length==0){
      return
    }
    this.setState({ progressPercentage: 0,totalDownloadedItem: 0,totalItemToDownload:this.state.filteredFileList.length , showProgressbar: true });
    this.state.filteredFileList.map((file) => {
      this.doDownload(file)
    });
  };

  handleDeletePress = (item, selectedIndex) => {
    this.setState({ selectedFile: item, selectedIndex });
    this.deleteDialog.toggleShow();
  };

  onDeletePress = async () => {
    this.setState({ isLoading: true });
    await FileAPI.deleteSubmissionFile(
      this.schoolId,
      this.classId,
      this.state.selectedFile
    );
    this.deleteDialog.toggleShow();
    await this.loadFiles();
    this.setState({ isLoading: false });
  };

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
    this.deleteDialog = null;
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.taskId = this.props.navigation.getParam("taskId", "");
    this.submissionId = this.props.navigation.getParam("submissionId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
    this.loadFiles = this.loadFiles.bind(this);
    this.doDownload = this.doDownload.bind(this);
    this.handleDownloadPress = this.handleDownloadPress.bind(this);
    this.handleDownloadAll = this.handleDownloadAll.bind(this);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.handleSearchPress = this.handleSearchPress.bind(this);

  }

  componentDidMount() {
    this.loadFiles();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <View style={styles.subjectContainer}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {this.subject}
          </Text>
          <Text style={{ fontSize: 18 }}>{this.subjectDesc}</Text>
        </View>
        <View style={{ margin: 16 }}>
          <Searchbar 
            onChangeText={searchText => {this.setState({searchText})}}
            onSubmitEditing={this.handleSearchPress}
            value={this.state.searchText}
            placeholder="Cari Tugas" />
        </View>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <FlatList
            data={this.state.filteredFileList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <FileListItem
                  onDownloadPress={() => this.handleDownloadPress(item)}
                  onDeletePress={() => this.handleDeletePress(item, index)}
                  file={item}
                />
              );
            }}
          />
          <Button
            text="Unduh Semua Tugas"
            style={{ margin: 16 }}
            isLoading={this.state.isDownloadAllLoading}
            onPress={this.handleDownloadAll}
          />
        </View>
        <Portal>
          <Dialog visible={this.state.showProgressbar}>
            <Dialog.Content
              style={{ flexDirection: "row", justifyContent: "space-evenly" }}
            >
              <View>
                <Text>Mendownload Tugas</Text>
                <ProgressBar
                  progress={this.state.progressPercentage}
                  color="red"
                />
                <Text style={{ textAlign: "center" }}>{this.state.totalDownloadedItem} / {this.state.totalItemToDownload} </Text>
              </View>
            </Dialog.Content>
          </Dialog>
        </Portal>
        <DeleteDialog
          ref={i => (this.deleteDialog = i)}
          title={"Apakah anda ingin menghapus file ini?"}
          onDeletePress={this.onDeletePress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subjectContainer: {
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
