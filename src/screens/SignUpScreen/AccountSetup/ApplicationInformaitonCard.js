import React from "react";
import { Card, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";

import TextInput from "../../../components/TextInput";

const INITIAL_STATE = { nickName: "", id: "" }

export default class ApplicationInformationCard extends React.Component{
  handleNickNameChange = nickName => this.setState({nickName});
  handleIdChange = id => {
    const lowerId = id.toLowerCase()
    this.setState({id: lowerId})
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleNickNameChange = this.handleNickNameChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
  }

  getState(){ return this.state }

  render(){
    return(
      <Card>
        <Card.Title title="Informasi Aplikasi" subtitle="Kamu dapat menggunakan nama panggilan untuk ditampilkan pada dunia loh. Ayo buat sekarang"/>
        <Card.Content>
          <View>
            <Text style={styles.headerText}>Mono ID</Text>
            <TextInput 
              placeholder="Mono ID"
              textContentType="nickname"
              value={this.state.id}
              onChangeText={this.handleIdChange}/>
          </View>
          <View>
            <Text style={styles.headerText}>Nama Panggilam</Text>
            <TextInput 
              placeholder="Nama Panggilan"
              textContentType="name"
              value={this.state.nickName}
              onChangeText={this.handleNickNameChange}/>
          </View>
        </Card.Content>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  headerText: { paddingBottom: 4 }
})
