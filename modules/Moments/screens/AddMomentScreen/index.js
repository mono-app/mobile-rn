import React from "react";
import { View, TextInput } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import PeopleInformation from "./ProfileInformation";
import PhotoGrid from "modules/Moments/components/PhotoGrid";

import MomentAPI from "../../api/moment";
import PeopleAPI from "src/api/people";

const INITIAL_STATE = { content: "", images: [], isSubmitting: false, isError: false, errorMessage: null };

export default class AddMomentScreen extends React.Component{
  static navigationOptions = { headerTitle: "Menambahkan Moment" };

  handleGalleryComplete = images => this.setState({ images });
  handleGalleryIconPress = () => this.props.navigation.navigate("Gallery", { onComplete: this.handleGalleryComplete});
  handleContentChange = content => this.setState({ content });
  handleSubmitMoment = () => {
    this.setState({ isSubmitting: true });

    if(this.photoGrid !== null){
      const imagesPath = this.photoGrid.getImagesPath();
      new PeopleAPI().getCurrentUserEmail().then(currentUserEmail => {
        const content = { message: this.state.content, images: imagesPath };
        return MomentAPI.publishMoment(currentUserEmail, content);
      }).then(() => {
        this.setState({ content: "", images: [], isSubmitting: false });
        this.props.navigation.goBack();
      })
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