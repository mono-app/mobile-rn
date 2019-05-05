import React from "react";
import { View, Dimensions, Image } from "react-native";
import { Button } from "react-native-paper";
import { TextInput } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import PeopleInformation from "./ProfileInformation";

import MomentAPI from "../../api/moment";
import PeopleAPI from "src/api/people";

const INITIAL_STATE = { content: "", isSubmitting: false, isError: false, errorMessage: null };

export default class AddMomentScreen extends React.Component{
  static navigationOptions = { headerTitle: "Menambahkan Moment" };

  handleContentChange = content => this.setState({ content });
  handleSubmitMoment = () => {
    this.setState({ isSubmitting: true });

    new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
      const content = { message: this.state.content };
      return MomentAPI.publishMoment(currentUserEmail, content);
    }).then(() => {
      this.setState({ content: "", isSubmitting: false });
      this.props.navigation.goBack();
    });
  };

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleSubmitMoment = this.handleSubmitMoment.bind(this);
  }

  render(){
    // const window = Dimensions.get("window");

    return(
      <KeyboardAwareScrollView>
        <PeopleInformation/>

        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <TextInput
            multiline={true}
            textAlignVertical="top"
            numberOfLines={4}
            placeholder="Apa yang sedang Anda pikirkan?"
            fontSize={24}
            value={this.state.content}
            onChangeText={this.handleContentChange}/>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row" }}>
              {/* <IconButton size={24} icon="photo-library" color="rgba(0, 0, 0, .54)"/>
              <IconButton size={24} icon="photo-camera" color="rgba(0, 0, 0, .54)"/> */}
            </View>
            <Button 
              loading={this.state.isSubmitting} 
              disabled={this.state.isSubmitting} 
              mode="contained" 
              onPress={this.handleSubmitMoment}>
              Publikasi
            </Button>
          </View>
        </View>

        {/* <View style={{ backgroundColor: "gray", flex: 1 }}>
          <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: 200, alignItems: "stretch", resizeMode: "cover" }}/>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly" }}>
            <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: (window.width/4), alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
            <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: (window.width/4), alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
            <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ height: (window.width/4), alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
            <View style={{ alignSelf: "stretch", flex: 1, height: (window.width/4) }}>
              <Image source={{ uri: "https://picsum.photos/1080/720/?random" }} style={{ alignSelf: "stretch", flex: 1, resizeMode: "cover" }}/>
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, .7)", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "white" }}>+7</Text>
              </View>
            </View>
          </View>
        </View> */}
      </KeyboardAwareScrollView>
    )
  }
}