import React from "react";
import { Dialog, Portal, Paragraph, Button } from "react-native-paper";

const INITIAL_STATE = { isVisible: false }

export default class SignOutDialog extends React.Component{
  toggleShow = () => this.setState({ isVisible: !this.state.isVisible });

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.toggleShow = this.toggleShow.bind(this);
  }

  render(){
    return(
      <Portal>
        <Dialog visible={this.state.isVisible}>
          <Dialog.Title>Perhatian</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Apakah Anda yakin ingin keluar dari aplikasi ini?</Paragraph>
            <Paragraph>Anda harus masuk lagi ke aplikasi ini untuk tetap dapat menerima pesan.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button color="#5E8864" onPress={() => this.toggleShow()}>Batal</Button>
            <Button color="#EF6F6C" onPress={this.props.onSignOutPress}>Keluar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    )
  }
}