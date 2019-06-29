import React from "react";
import { View, TextInput } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import MomentAPI from "modules/Moments/api/moment";
import CurrentUserAPI from "src/api/people/CurrentUser";

import PeopleInformation from "./ProfileInformation";
import PhotoGrid from "modules/Moments/components/PhotoGrid";
import AppHeader from "src/components/AppHeader";

const INITIAL_STATE = { content: "", images: [], isSubmitting: false, isError: false, errorMessage: null };

export default class AddMomentScreen extends React.Component{
  static navigationOptions = ({ navigation }) => {
    return { header: <AppHeader title="Menambahkan Moment" navigation={navigation} style={{ backgroundColor: "white" }}/>}
  }

  handleGalleryComplete = images => this.setState({ images });
  handleGalleryIconPress = () => this.props.navigation.navigate("Gallery", { onComplete: this.handleGalleryComplete});
  handleContentChange = content => this.setState({ content });
  handleSubmitMoment = async () => {
    this.setState({ isSubmitting: true });

    if(this.photoGrid !== null){
      const imagesPath = this.photoGrid.getImagesPath();
      const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
      const content = { message: this.state.content, images: imagesPath };
      
      await MomentAPI.publishMoment(currentUserEmail, content);
      this.setState({ content: "", images: [], isSubmitting: false });
      this.props.navigation.goBack();
    }
  };

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.photoGrid = null;
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleSubmitMoment = this.handleSubmitMoment.bind(this);
    this.handleGalleryIconPress = this.handleGalleryIconPress.bind(this);
    this.handleGalleryComplete = this.handleGalleryComplete.bind(this);
  }

  render(){
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
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row" }}>
              <IconButton size={24} icon="photo-library" color="rgba(0, 0, 0, .54)" onPress={this.handleGalleryIconPress}/>
              <IconButton size={24} icon="photo-camera" color="rgba(0, 0, 0, .54)"/>
            </View>
            <Button 
              loading={this.state.isSubmitting} 
              disabled={this.state.isSubmitting} 
              mode="contained" 
              onPress={this.handleSubmitMoment}>Publikasi</Button>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <PhotoGrid ref={i => this.photoGrid = i} images={this.state.images}/>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}