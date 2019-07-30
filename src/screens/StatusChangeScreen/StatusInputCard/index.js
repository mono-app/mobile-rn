import React from "react";
import { View, TextInput } from "react-native";
import { Card, Button } from "react-native-paper";

import PeopleAPI from "src/api/people";
import StatusAPI from "src/api/status";

const INITIAL_STATE = { status: "", isLoading: false }

export default class StatusInputCard extends React.Component{
  handleStatusChange = status => this.setState({ status });
  handleSavePress = () => {
    this.setState({ isLoading: true });
    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      StatusAPI.postStatus(currentUserEmail, this.state.status);
    }).then(() => {
      this.setState({ isLoading: false, status: "" });
      if(this.props.onSaved) this.props.onSaved();
      const { navigation } = this.props;
      if(navigation.state.params.onRefresh()){
        navigation.state.params.onRefresh();
        navigation.goBack();
      }
      
    }).catch(err => console.log(err));
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.statusListener = null;
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleSavePress = this.handleSavePress.bind(this);
  }

  render(){
    return(
      <Card elevation={4} style={{ padding: 16, margin: 16 }}>
        <TextInput
          multiline={true}
          textAlignVertical="top"
          numberOfLines={4}
          placeholder="Bagikan statusmu sekarang."
          fontSize={24}
          value={this.state.status}
          onChangeText={this.handleStatusChange}/>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Button 
            mode="text"
            loading={this.state.isLoading}
            disabled={this.state.isLoading}
            onPress={this.handleSavePress}>Simpan</Button>
        </View>
      </Card>
    )
  }
}