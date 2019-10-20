import React from "react";
import { Dialog, Portal, Paragraph, Button } from "react-native-paper";

const INITIAL_STATE = { isVisible: false }

export default class DeleteDialog extends React.PureComponent{
  toggleShow = () => this.setState({ isVisible: !this.state.isVisible });

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.toggleShow = this.toggleShow.bind(this);
  }

  render(){
    return(
      <Portal>
        <Dialog visible={this.state.isVisible} 
          onDismiss={this.toggleShow}>
          <Dialog.Title>Perhatian</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{this.props.title}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button color="#5E8864" onPress={() => this.toggleShow()}>Batal</Button>
            <Button color="#EF6F6C" onPress={this.props.onDeletePress}>Hapus</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    )
  }
}