import React from "react";
import { 
  Portal, Dialog, Paragraph, Button as MaterialButton 
} from "react-native-paper";
import { StackActions } from "react-navigation";

export default class AddedFriendRequestDialog extends React.PureComponent{
  handlePress = () => this.props.navigation.dispatch(StackActions.popToTop())

  constructor(props){
    super(props);

    this.handlePress = this.handlePress;
  }

  render(){
    return(
      <Portal>
        <Dialog visible={this.props.visible}>
          <Dialog.Content>
            <Paragraph>Berhasil menambahkan pertemanan</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <MaterialButton onPress={this.handlePress}>Ok</MaterialButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    )
  }
}