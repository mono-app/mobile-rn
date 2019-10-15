import React from "react";
import { View, Picker, TouchableOpacity, StyleSheet } from "react-native";
import { Card, Text, Caption } from "react-native-paper";

import TextInput from "src/components/TextInput";

const INITIAL_STATE = {
  givenName: "",
  familyName: "",
  gender: "male"
}

export default class PersonalInformationCard extends React.PureComponent{
  handleGivenNameChange = givenName => this.setState({givenName});
  handleFamilyNameChange = familyName => this.setState({familyName});
  handleGenderChange = (gender, index) => this.setState({gender});

  constructor(props){
    super(props);

    INITIAL_STATE.givenName = props.defaultGivenName
    INITIAL_STATE.familyName = props.defaultFamilyName
    INITIAL_STATE.gender = props.defaultGender
    this.state = INITIAL_STATE;
    this.handleGivenNameChange = this.handleGivenNameChange.bind(this);
    this.handleFamilyNameChange = this.handleFamilyNameChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
  } 

  getState(){ return this.state }

  render(){
    return(
      <Card>
        <Card.Title title="Informasi Pribadi"/>
        <Caption style={{marginHorizontal:16, marginTop:0, marginBottom: 16}}>
          Masukan informasi pribadi kamu. Tenang, kami akan menjaga kerahasiaan data kamu
        </Caption>
        <Card.Content>
          <View>
            <Text style={styles.headerText}>Nama Depan</Text>
            <TextInput 
              placeholder="Nama Depan"
              textContentType="givenName"
              value={this.state.givenName}
              onChangeText={this.handleGivenNameChange}/>
          </View>
          <View>
            <Text style={styles.headerText}>Nama Belakang</Text>
            <TextInput 
              placeholder="Nama Belakang"
              textContentType="familyName"
              value={this.state.familyName}
              onChangeText={this.handleFamilyNameChange}/>
          </View>
          <View>
            <Text style={styles.headerText}>Jenis Kelamin</Text>
            <Picker
              selectedValue={this.state.gender}
              onValueChange={this.handleGenderChange}>
              <Picker.Item label="Perempuan" value="female" />
              <Picker.Item label="Laki-Laki" value="male" />
            </Picker>
          </View>
        </Card.Content>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  headerText: { paddingBottom: 4 }
})