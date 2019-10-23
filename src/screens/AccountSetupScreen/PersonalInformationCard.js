import React from "react";
import { View, Picker, StyleSheet } from "react-native";
import { Card, Text, Caption } from "react-native-paper";
import TextInput from "src/components/TextInput";

const INITIAL_STATE = {
  givenName: "",
  familyName: "",
  gender: "male"
}

class PersonalInformationCard extends React.PureComponent{
  handleGivenNameChange = givenName => {
    const fGinvenName = givenName.replace(/[^a-zA-Z\s]/gi,'')
    this.setState({givenName: fGinvenName});
  }
  handleFamilyNameChange = familyName => {
    const fFamilyName = familyName.replace(/[^a-zA-Z\s]/gi,'')
    this.setState({familyName: fFamilyName});
  }
  handleGenderChange = (gender, index) => {this.setState({gender});}

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
        <Card.Title title={this.props.t("personalInfo")}/>
        <Caption style={{marginHorizontal:16, marginTop:0, marginBottom: 16}}>
          {this.props.t("personalInfoDesc")}
        </Caption>
        <Card.Content>
          <View>
            <Text style={styles.headerText}>{this.props.t("firstName")}</Text>
            <TextInput 
              placeholder={this.props.t("firstName")}
              textContentType="givenName"
              autoCorrect={false}
              maxLength={50}
              value={this.state.givenName}
              onChangeText={this.handleGivenNameChange}/>
          </View>
          <View>
            <Text style={styles.headerText}>{this.props.t("lastName")}</Text>
            <TextInput 
              placeholder={this.props.t("lastName")}
              textContentType="familyName"
              autoCorrect={false}
              maxLength={50}
              value={this.state.familyName}
              onChangeText={this.handleFamilyNameChange}/>
          </View>
          <View>
            <Text style={styles.headerText}>{this.props.t("gender")}</Text>
            <Picker
              selectedValue={this.state.gender}
              onValueChange={this.handleGenderChange}>
              <Picker.Item label={this.props.t("female")} value="female" />
              <Picker.Item label={this.props.t("male")} value="male" />
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

export default PersonalInformationCard