import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import SquareAvatar from "src/components/Avatar/Square";
import Header from "../../../components/Header";

const INITIAL_STATE = {
  isLoading: false,
  profilePicture: "https://picsum.photos/200/200/?random"
};

export default class SchoolAdminHomeScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return { header: <Header navigation={navigation} title="School Admin" /> };
  };

  handleAddPress = e => {
    this.props.navigation.navigate("SchoolAdminAdd");
  };

  handleDataMasterPress = e => {
    this.props.navigation.navigate("SchoolAdminDataMaster");
  };
  
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleAddPress = this.handleAddPress.bind(this);
    this.handleDataMasterPress = this.handleDataMasterPress.bind(this);
  }

  render() {
    return (
      <View style={styles.groupContainer}>
        <View style={styles.logo}>
          <SquareAvatar size={100} uri={this.state.profilePicture}/>
          <Text style={{ fontWeight: "700", marginTop: 16, fontSize: 20 }}>
            Selamat Datang,
          </Text>
          <Text style={{ fontWeight: "400", fontSize: 16 }}>School Admin</Text>
        </View>

        <View style={{marginBottom: 64}}/>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.handleAddPress} >
            <View style={styles.button} >
              <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                <FontAwesome name="plus" style={{color: "#fff"}} size={24} />
              </View>
            </View>
            <Text>Tambah</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleDataMasterPress}>
            <View style={styles.button} >
              <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
                <FontAwesome name="cog" style={{color: "#fff"}} size={24} />
              </View>
            </View>
            <Text>Data Master</Text>
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
    height: 60,
    width: 60,
    borderColor: "#fff",
    borderRadius: 12
  }
});
