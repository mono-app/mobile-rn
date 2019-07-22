import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, Caption } from "react-native-paper";
import TextInput from "src/components/TextInput";
import Button from "src/components/Button";
import AppHeader from "src/components/AppHeader";

export default class AddClassScreen extends React.PureComponent{
  static navigationOptions = ({ navigation }) => {
    return { header: <AppHeader navigation={navigation} title="Tambah Kelas Baru"/> }
  }

  handleSavePress = () => {
    this.setState({ isLoading: true });
  }

  constructor(props){
    super(props);
    this.state = {
      isLoading: false
    }
  }

  render(){
    return(
      <View style={styles.container}>
        <Title style={{ marginBottom: 8 }}>Nama Kelas</Title>
        <TextInput
          style={{ marginBottom: 0 }}
          placeholder="Nama Kelas"
          value=""
          />
        {this.caption !== null?(
          <Caption>{this.caption}</Caption>
        ):null}
        <View style={{ paddingVertical: 8 }}/>
        <Button
          text="Simpan"
          isLoading={this.state.isLoading}
          onPress={this.handleSavePress}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#E8EEE8" }
})