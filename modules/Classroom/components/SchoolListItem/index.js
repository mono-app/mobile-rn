import React from "react";
import ContentLoader from 'rn-content-loader'
import {Rect} from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Paragraph } from "react-native-paper";
import SchoolAdminAPI from "modules/Classroom/api/schooladmin"
import SquareAvatar from "src/components/Avatar/Square";

const INITIAL_STATE = { 
  school: {}, 
  isFetching: false,
  defaultProfilePic: "https://picsum.photos/200/200/?random",
  userName: "" 
}

/**
 * @param {string} subject 
 * @param {string} classId
 */
export default class SchoolListItem extends React.Component{
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
  }

  async componentDidMount(){
    this.setState({ isFetching: true });
    const { school, currentUserId } = this.props;
    const schoolAdmin = await SchoolAdminAPI.getDetail(school.id, currentUserId )
    this.setState({isFetching:false, school, userName: schoolAdmin.name})
  }

  render(){
    if(this.state.isFetching){
      return (
        <ContentLoader height={50}>
          <Rect x={86} y={16} rx="4" ry="4" width={150} height={12}/>
        </ContentLoader>
      )
    }
    let schoolProfilePic = this.state.defaultProfilePic

    if(this.state.school.profilePicture && this.state.school.profilePicture.downloadUrl){
      schoolProfilePic = this.state.school.profilePicture.downloadUrl
    }

    return(
      <TouchableOpacity style={styles.userContainer} onPress={this.props.onPress}>
        <View style={{flexDirection:"row"}}>
          <SquareAvatar size={40} uri={schoolProfilePic}/>
          <View style={{marginLeft:16, flex:1}}>
            <Text style={{ fontWeight: "700" }}>{this.state.school.name}</Text>
            <Paragraph style={{ color: "#5E8864" }}>{this.state.userName}</Paragraph>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  userContainer: {
    height: 50,
    padding:16,
    borderBottomWidth:1,
    borderBottomColor: "#E8EEE8",
    flexDirection: "row",
    alignItems: "center",
  }
})