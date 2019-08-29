import React from "react";
import { Searchbar } from "react-native-paper";

const INITIAL_STATE = { isVisible: false, searchText: "" }

export default class MySearchbar extends React.PureComponent{

  handleChangeText = (searchText) => {
    this.setState({searchText})
  }

  handleOnSubmit = () => {
    this.props.onSubmitEditing(this.state.searchText)
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  render(){
    return(
      <Searchbar 
        style={this.props.style}
        onChangeText={this.handleChangeText}
        onSubmitEditing={this.handleOnSubmit}
        value={this.state.searchText}
        placeholder={this.props.placeholder} />
    )
  }
}