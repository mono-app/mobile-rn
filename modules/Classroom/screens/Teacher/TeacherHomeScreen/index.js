import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Title, withTheme, Subheading } from "react-native-paper";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import SquareAvatar from "src/components/Avatar/Square";
import Header from "../../../components/Header";


const INITIAL_STATE = {
  isLoading: false,
  profilePicture: "https://picsum.photos/200/200/?random"
};

class TeacherHomeScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return { header: <Header navigation={navigation} title="Guru" /> };
  };

  handleAddPress = e => {
    this.props.navigation.navigate("SchoolAdminAdd");
  };

  handleDataMasterPress = e => {
    this.props.navigation.navigate("SchoolAdminDataMaster");
  };

  handleTeacherProfilePress = e => {
    this.props.navigation.navigate("MyProfile");
  };
  
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleAddPress = this.handleAddPress.bind(this);
    this.handleDataMasterPress = this.handleDataMasterPress.bind(this);
    this.handleTeacherProfilePress = this.handleTeacherProfilePress.bind(this);
  }

  render() {
    return (
      <View style={styles.groupContainer}>
        <View style={styles.logo}>
          <SquareAvatar size={100} uri={this.state.profilePicture}/>
          <TouchableOpacity onPress={this.handleTeacherProfilePress} style={{marginTop:16}}>
            <Text style={{ color: this.props.theme.colors.primary }}>Lihat Profile</Text>
          </TouchableOpacity>
          <Title style={{marginTop: 22}}>
            Selamat Datang,
          </Title>
          <Subheading>Henry Sanders</Subheading>
        </View>

        <View style={{marginBottom: 64}}/>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.handleDataMasterPress}>
              <View style={styles.button} >
                <FontAwesome name="list" style={{color: "#fff"}} size={24} />
              </View>
              <Text>Lihat kelas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleAddPress} >
              <View style={styles.button} >
                <FontAwesome name="plus" style={{color: "#fff"}} size={24} />
              </View>
              <Text>Tambah Tugas</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8EEE8", color: "black" },
  logo: {
    marginTop: 36,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  groupContainer: {  flex: 1, backgroundColor: "#E8EEE8"},
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  menu: {
    padding: 16,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8"
  },
  button: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#0EAD69",
    padding:16,
    borderColor: "#fff",
    borderRadius: 12
  }
});

export default withTheme(TeacherHomeScreen)