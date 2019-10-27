import React from "react";
import moment from "moment";
import { NavigationEvents } from "react-navigation";
import { View } from "react-native";
import { Paragraph , Button, Title, Card } from "react-native-paper";

import PeopleAPI from "src/api/people";
import Navigator from "src/api/navigator";

const INITIAL_STATE = { isVisible: false };

export default class BirthdaySetupBanner extends React.Component{
  toggleVisible = () => this.setState({ isVisible: !this.state.isVisible });

  handleBeforeSave = value => moment(value, "DD/MM/YYYY").isValid();
  handleProceedPress = () => {
    new PeopleAPI().getCurrentUserId().then(currentUserId => {
      const payload = {
        databaseCollection: "users",
        databaseDocumentId: currentUserId,
        databaseFieldName: "personalInformation.dateOfBirth",
        caption: "Format tanggal lahir: 22/12/2007",
        placeholder: "DD/MM/YYYY",
        fieldValue: "",
        fieldTitle: "Tanggal Lahir",
        beforeSave: this.handleBeforeSave
      }
      const navigator = new Navigator(this.props.navigation);
      navigator.navigateTo("EditSingleField", payload);
    })
  }

  handleComponentWillFocus = () => {
    const peopleAPI = new PeopleAPI();
    peopleAPI.getCurrentUserId().then(currentUserId => {
      return peopleAPI.getDetail(currentUserId);
    }).then(people => {
      if(people.personalInformation.dateOfBirth === undefined) this.setState({ isVisible: true });
      else this.setState({ isVisible: false });
    })
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.toggleVisible = this.toggleVisible.bind(this);
    this.handleProceedPress = this.handleProceedPress.bind(this);
    this.handleBeforeSave = this.handleBeforeSave.bind(this);
    this.handleComponentWillFocus = this.handleComponentWillFocus.bind(this);
  }

  render(){
    const display = this.state.isVisible? "flex": "none";
    return(
      <Card elevation={4} style={{ margin: 16, padding: 16, display }}>
        <NavigationEvents onWillFocus={this.handleComponentWillFocus}/>

        <Title>Pemberitahuan</Title>
        <Paragraph >Kasih tahu Mono tanggal lahirmu dong, agar Mono bisa kasih kado spesial buat kamu.</Paragraph >
        <View style={{ flexDirection: "row-reverse" }}>
          <Button mode="text" onPress={this.handleProceedPress}>Kasih Tahu</Button>
          <Button mode="text" onPress={this.toggleVisible}>Nanti Saja</Button>
        </View>
      </Card>
    )
  }
}