import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { ProgressBar,Caption,Searchbar,Text,Dialog,Portal } from "react-native-paper";
import FileListItem from "../../../components/FileListItem";
import AppHeader from "src/components/AppHeader";
import FileAPI from "../../../api/file";
import {  TouchableOpacity } from "react-native-gesture-handler";
import RNBackgroundDownloader from "react-native-background-downloader";
import DeleteDialog from "src/components/DeleteDialog";

const INITIAL_STATE = { isLoading: true, progressPercentage: 0, showProgressbar: false, isDeleting: false, selectedFile: null, selectedIndex: -1 };

export default class ClassFilesScreen extends React.PureComponent {
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
    this.setState({ fileList: [], isLoading: true });

    const fileList = await FileAPI.getClassFiles(this.schoolId, this.classId);
    this.setState({ fileList });
    this.setState({isLoading: false})

  }

  handleDownloadPress = item => {
    this.setState({progressPercentage:0,showProgressbar: true})
    let task = RNBackgroundDownloader.download({
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

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.loadFiles = this.loadFiles.bind(this);
    this.handleDownloadPress = this.handleDownloadPress.bind(this);
    this.onDeletePress = this.onDeletePress.bind(this);
    this.deleteDialog = null;
    this.schoolId = this.props.navigation.getParam("schoolId", "");
    this.classId = this.props.navigation.getParam("classId", "");
    this.subject = this.props.navigation.getParam("subject", "");
    this.subjectDesc = this.props.navigation.getParam("subjectDesc", "");
  
  }

  componentDidMount(){
    this.loadFiles();
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
        <View style={{marginTop: 8 }}>
          <Searchbar placeholder="Cari Berkas" />
        </View>
      
        <FlatList
          style={{ backgroundColor: "white", marginTop:8 }}
          data={this.state.fileList}
          renderItem={({ item, index }) => {
            return (
              <FileListItem 
                onDownloadPress={() => this.handleDownloadPress(item)}
                onDeletePress={() => this.handleDeletePress(item, index)}
                key={index} file={item} />
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
