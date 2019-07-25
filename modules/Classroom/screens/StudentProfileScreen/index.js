import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Card, Dialog, Text, Caption } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import StudentAPI from "../../api/student";
import CircleAvatar from "src/components/Avatar/Circle";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

const INITIAL_STATE = { isLoadingProfile: true, student: null, schoolId: "1hZ2DiIYSFa5K26oTe75"  }

/**
 * Parameter list
 * 
 * @param {string} studentEmail
 */
export default class StudentProfileScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Profil Murid"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };

  loadPeopleInformation = async () => {
    this.setState({ isLoadingProfile: true });

    const api = new StudentAPI();
      const promises = [ api.getDetail("1hZ2DiIYSFa5K26oTe75", this.studentEmail)];

      Promise.all(promises).then(results => {
        const student = results[0];
        this.setState({ isLoadingProfile: false, student });
      })
  }

  handleNamePress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "students",
      databaseDocumentId: this.studentEmail,
      databaseFieldName: "name", 
      fieldValue: this.state.student.name,
      fieldTitle: "Edit Nama Murid",
      onRefresh: () => {this.loadPeopleInformation()}
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleAddressPress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "students",
      databaseDocumentId: this.studentEmail,
      databaseFieldName: "address", 
      fieldValue: this.state.student.address,
      fieldTitle: "Edit Alamat",
      onRefresh: () => {this.loadPeopleInformation()}
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handlePhonePress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "students",
      databaseDocumentId: this.studentEmail,
      databaseFieldName: "phone", 
      fieldValue: this.state.student.phone,
      fieldTitle: "Edit Telepon",
      isNumber: true,
      onRefresh: () => {this.loadPeopleInformation()}
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleEmailPress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "students",
      databaseDocumentId: this.studentEmail,
      databaseFieldName: "email", 
      fieldValue: this.state.student.email,
      fieldTitle: "Edit Email",
      onRefresh: () => {this.loadPeopleInformation()}
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleNoIndukPress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "students",
      databaseDocumentId: this.studentEmail,
      databaseFieldName: "nik", 
      fieldValue: this.state.student.nik,
      fieldTitle: "Edit NIK",
      isNumber: true,
      onRefresh: () => {this.loadPeopleInformation()}
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  handleGenderPress = e => {
    const payload = {
      schoolId: this.state.schoolId,
      databaseCollection: "students",
      databaseDocumentId: this.studentEmail,
      databaseFieldName: "gender", 
      fieldValue: this.state.student.gender,
      fieldTitle: "Edit Jenis Kelamin",
      isGender: true,
      onRefresh: () => {this.loadPeopleInformation()} 
    }
    this.props.navigation.navigate(`EditSingleField`, payload);
  }

  constructor(props){
    super(props);
    this.studentEmail = this.props.navigation.getParam("studentEmail", null);
    this.state = INITIAL_STATE;
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
    this.handleNamePress = this.handleNamePress.bind(this);
    this.handleAddressPress = this.handleAddressPress.bind(this);
    this.handlePhonePress = this.handlePhonePress.bind(this);
    this.handleEmailPress = this.handleEmailPress.bind(this);
    this.handleNoIndukPress = this.handleNoIndukPress.bind(this);
    this.handleGenderPress = this.handleGenderPress.bind(this);
  }

  componentDidMount(){ 
    this.loadPeopleInformation(); 
  }

  render(){
    if(this.state.isLoadingProfile){
      return (
        <Dialog visible={true}>
          <Dialog.Content style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <ActivityIndicator/>
            <View>
              <Text>Sedang memuat data</Text>
              <Caption>Harap tunggu...</Caption>
            </View>
          </Dialog.Content>
        </Dialog>
      )
    }else return (
      <View style={{ flex: 1, backgroundColor: "#E8EEE8" }}>
        <ScrollView>
          <Card style={{margin: 16}}>
            <Text style={{ marginLeft: 16, marginTop: 16, fontSize: 20 }}>{this.state.student.name}</Text>

            <View style={styles.profileContainer}>
              <Text style={{  fontSize: 16 }}></Text>
                <CircleAvatar
                  size={80}
                  uri="https://picsum.photos/200/200/?random"
                />            
            
            </View>
            <View>
              <TouchableOpacity onPress={this.handleNamePress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text>Nama murid</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.student.name}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity  onPress={this.handleAddressPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text>Alamat</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.student.address}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity  onPress={this.handlePhonePress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text>Nomor Telepon</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.student.phone}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity  onPress={this.handleEmailPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text >Email</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.student.email}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity  onPress={this.handleNoIndukPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text >No Induk</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.student.noInduk}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleGenderPress}>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text >Jenis Kelamin</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>{this.state.student.gender}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8",
    backgroundColor: "white",
    flexDirection: "row",
    padding: 16,
    alignItems: "center"
  },
  listDescriptionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
})