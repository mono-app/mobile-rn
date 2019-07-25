import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import { default as FontAwesome } from "react-native-vector-icons/FontAwesome";
import CircleAvatar from "src/components/Avatar/Circle";
import Header from "./Header";

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
          <CircleAvatar size={126} uri={this.state.profilePicture} />
          <Text style={{ fontWeight: "700", marginTop: 16, fontSize: 20 }}>
            Selamat Datang,
          </Text>
          <Text style={{ fontWeight: "400", fontSize: 16 }}>School Admin</Text>
        </View>

        <View style={{marginTop: 64}}/>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.handleAddPress} >
            <FontAwesome name="plus" style={{color: "#fff"}} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.handleDataMasterPress}>
            <FontAwesome name="cog" style={{color: "#fff"}} size={24} />
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
    backgroundColor: "#0EAD69",
    padding: 16,
    borderColor: "#fff",
    borderRadius: 12
  }
});
