import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import Header from "./Header";

export default class SchoolAdminHomeScreen extends React.PureComponent {
  
  static navigationOptions = ({ navigation }) => {
    return { header: <Header navigation={navigation} title="School Admin"/> }
  }

  handleAddClassPress = e => {
    this.props.navigation.navigate('AddClass');
  }

  constructor(props){
    super(props);
    this.handleAddClassPress = this.handleAddClassPress.bind(this);
  }

  render() {
    return (
        <View style={styles.groupContainer}>
          <TouchableOpacity onPress={this.handleAddClassPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "400" }}>Tambah Kelas Baru</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleAddClassPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "400" }}>Tambah Guru</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleAddClassPress}>
            <View style={styles.menu}>
              <Text style={{ fontWeight: "400" }}>Tambah Murid</Text>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8EEE8", color: "black" },
  groupContainer: { marginBottom: 16 },
  menu: { 
    padding: 16,
    backgroundColor: "white", 
    display: "flex", 
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8",
  }
});