import React from "react";
import ContentLoader from 'rn-content-loader'
import {Rect} from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Paragraph } from "react-native-paper";
import SchoolAPI from "modules/Classroom/api/school"

const INITIAL_STATE = { school: {}, isFetching: false }

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

    let { school } = this.props;

    if(!school.name){
      school = await SchoolAPI.getDetail(school.id);
    }
    this.setState({isFetching:false, school})
  }

  render(){
    if(this.state.isFetching){
      return (
        <ContentLoader height={50}>
          <Rect x={86} y={16} rx="4" ry="4" width={150} height={12}/>
        </ContentLoader>
      )
    }


    return(
      <TouchableOpacity style={styles.userContainer} onPress={this.props.onPress}>
        <View>
          <Text style={{ fontWeight: "700" }}>{this.state.school.name}</Text>
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