import React from "react";
import ContentLoader from 'rn-content-loader'
import {Rect} from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import Icon from 'react-native-vector-icons/FontAwesome';

const INITIAL_STATE = { name: "", isFetching: false, checked: false }

/**
 * @param {string} name 
 * @param {string} userId
 */
export default class ShareDiscussionListItem extends React.Component{
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
  }

  async componentDidMount(){
    this.setState({ isFetching: true });


    this.setState({ isFetching: false });
  }

  render(){
    if(this.state.isFetching){
      return (
        <ContentLoader style={styles.userContainer}>
          <Rect x={86} y={16} rx="4" ry="4" width={150} height={12}/>
        </ContentLoader>
      )
    }

    const { applicationInformation, checked } = this.props.user;
  
    return(
      <TouchableOpacity onPress={this.props.onPress}>
          <View style={styles.listItemContainer}>
            <View style={styles.listDescriptionContainer}>
              <View>
                <Text style={{ fontWeight: "700" }}>{applicationInformation.nickName}</Text>
              </View>
              {(checked)? 
                <Icon name="check-circle" size={16} color="#0EAD69" style={{marginTop: 2, marginRight: 4}}/> 
              : 
                <Icon name="circle" size={16} color="#dedede" style={{marginTop: 2, marginRight: 4}}/> 
              }


            </View>
          </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8",
    backgroundColor: "white",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center"
  },
  listDescriptionContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
})