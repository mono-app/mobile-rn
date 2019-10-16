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
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";

const INITIAL_STATE = { isLoadingProfile: true, isLoadingButton: false ,class: null };


class ArchiveClassDetailsScreen extends React.PureComponent {
  static navigationOptions = () => {
    return {
      header: null
    };
  };
  
  loadClassInformation = async () => {
    this.setState({ isLoadingProfile: true });

    const class_ = await ClassAPI.getDetail(this.props.currentSchool.id, this.classId)
    if(this._isMounted){
      this.setState({ isLoadingProfile: false, class: class_ });
    }
  };

  handleUnarchivePress = async () => {
    this.setState({isLoadingButton: true})
    await ClassAPI.setUnarchive(this.props.currentSchool.id, this.classId)
  
    const { navigation } = this.props;
    navigation.state.params.onRefresh();
    navigation.goBack();

    this.setState({isLoadingButton: false})
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this._isMounted = null
    this.classId = this.props.navigation.getParam("classId", null);
    this.loadClassInformation = this.loadClassInformation.bind(this);
    this.handleUnarchivePress = this.handleUnarchivePress.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadClassInformation();
  }

  componentWillUnmount() {
     this._isMounted = false;
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
      <View style={{ flex:1, backgroundColor: "#E8EEE8" }}>
        <AppHeader
            navigation={this.props.navigation}
            title="Info Kelas"
            style={{ backgroundColor: "white" }}
          />
        <ScrollView style={{marginBottom:56}}>
          <PeopleProfileHeader
            style={{padding: 16, marginTop: 16}}
            profilePicture="https://picsum.photos/200/200/?random"
            title={this.state.class.subject}
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
            disabled={this.state.isLoadingButton}
            onPress={this.handleUnarchivePress}/>
        </ScrollView>
      </View>
    )
  }
}
export default withCurrentSchoolAdmin(ArchiveClassDetailsScreen)
