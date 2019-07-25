import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Card, Dialog, Text, Caption } from "react-native-paper";
import AppHeader from "src/components/AppHeader";
import TeacherAPI from "../../api/teacher";
import CircleAvatar from "src/components/Avatar/Circle";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";

const INITIAL_STATE = { isLoadingProfile: true, teacher: null }

/**
 * Parameter list
 * 
 * @param {string} teacherEmail
 */
export default class TeacherProfileScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          title="Profil Guru"
          style={{ backgroundColor: "transparent" }}
        />
      )
    };
  };



  loadPeopleInformation = async () => {
    this.setState({ isLoadingProfile: true });

    const api = new TeacherAPI();
      const promises = [ api.getDetail("1hZ2DiIYSFa5K26oTe75", this.teacherEmail)];

      Promise.all(promises).then(results => {
        const teacher = results[0];
        this.setState({ isLoadingProfile: false, teacher });
      })
  }

  constructor(props){
    super(props);
    this.teacherEmail = this.props.navigation.getParam("teacherEmail", null);
    this.state = INITIAL_STATE;
    this.loadPeopleInformation = this.loadPeopleInformation.bind(this);
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
            <Text style={{ marginLeft: 16, marginTop: 16, fontSize: 20 }}>{this.state.teacher.name}</Text>

            <View style={styles.profileContainer}>
              <Text style={{  fontSize: 16 }}></Text>
                <CircleAvatar
                  size={80}
                  uri="https://picsum.photos/200/200/?random"
                />            
            
            </View>
            <View>
              <TouchableOpacity>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text>Nama guru</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.teacher.name}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text>Alamat</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>-</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text>Nomor Telepon</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>-</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text >Email</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>{this.state.teacher.id}</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text >NIK</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>-</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text >Jenis Kelamin</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                    <Text>-</Text>
                      <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.listItemContainer}>
                  <View style={styles.listDescriptionContainer}>
                    <Text >Jumlah Kelas</Text>
                    <View style={{flexDirection:"row",textAlign: "right"}}>
                      <Text>-</Text>
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