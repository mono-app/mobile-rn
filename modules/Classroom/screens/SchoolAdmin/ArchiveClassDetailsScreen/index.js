import React from "react";
import { View,StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Dialog,
  Text,
  Caption,
} from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import ClassAPI from "modules/Classroom/api/class";
import PeopleProfileHeader from "src/components/PeopleProfile/Header";
import PeopleInformationContainer from "src/components/PeopleProfile/InformationContainer";
import Button from "src/components/Button";

const INITIAL_STATE = { isLoadingProfile: true, isLoadingButton: false ,class: null };

/**
 * Parameter list
 *
 * @param {string} classId
 */
export default class ArchiveClassDetailsScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Info Kelas"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };
  
  loadClassInformation = async () => {
    this.setState({ isLoadingProfile: true });

    const class_ = await ClassAPI.getDetail(this.schoolId, this.classId)
    this.setState({ isLoadingProfile: false, class: class_ });

  };

  handleUnarchivePress = async () => {
    this.setState({isLoadingButton: true})
    await ClassAPI.setUnarchive(this.schoolId, this.classId)
  
    const { navigation } = this.props;
    navigation.state.params.onRefresh();
    navigation.goBack();

    this.setState({isLoadingButton: false})
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.schoolId = this.props.navigation.getParam("schoolId", null);
    this.classId = this.props.navigation.getParam("classId", null);
    this.loadClassInformation = this.loadClassInformation.bind(this);
    this.handleUnarchivePress = this.handleUnarchivePress.bind(this);
    
  }

  componentDidMount() {
    this.loadClassInformation();
  }

  render() {
    if (this.state.isLoadingProfile) {
      return (
        <Dialog visible={true}>
          <Dialog.Content
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <ActivityIndicator />
            <View>
              <Text>Sedang memuat data</Text>
              <Caption>Harap tunggu...</Caption>
            </View>
          </Dialog.Content>
        </Dialog>
      );
    } else 
    return (
      <View style={{ flex:1, backgroundColor: "#E8EEE8", paddingTop: 16 }}>
        <ScrollView>
          <PeopleProfileHeader
            profilePicture="https://picsum.photos/200/200/?random"
            nickName={this.state.class.subject}
            />

          <View style={{  marginVertical: 16 }}>  
            <PeopleInformationContainer
              fieldName="Ruangan"
              fieldValue={this.state.class.room}/>
            <PeopleInformationContainer
              fieldName="Semester"
              fieldValue={this.state.class.semester}/>
           <PeopleInformationContainer
              fieldName="Tahun Ajaran"
              fieldValue={this.state.class.academicYear}/>
          </View>
          
          <View style={{  padding: 16, backgroundColor: "#fff" }}>
            <Text style={{fontWeight: "bold"}}>Informasi Kelas</Text>
            <View style={{flexDirection:"row"}}>
              <Text>{this.state.class.information}</Text>
            </View>
          </View>
          <Button
            style={{margin: 16}}
            text="Pulihkan Kelas"
            isLoading={this.state.isLoadingButton}
            onPress={this.handleUnarchivePress}/>
        </ScrollView>
      </View>
    )
  }
}
