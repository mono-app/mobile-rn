import React from "react";
import { Searchbar } from "react-native-paper";

const INITIAL_STATE = { isVisible: false, searchText: "" }

export default class MySearchBar extends React.PureComponent{

  handleChangeText = (searchText) => {
    this.setState({searchText})
    this.props.onChangeText(searchText)
  }

  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
    this.handleChangeText = this.handleChangeText.bind(this);
  }

  render(){
    return(
      <Searchbar 
        style={this.props.style}
        onChangeText={this.handleChangeText}
        onSubmitEditing={this.props.onSubmitEditing}
        value={this.state.searchText}
        placeholder={this.props.placeholder} />
    )
  }
}