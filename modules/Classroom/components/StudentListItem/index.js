import React from "react";
import ContentLoader from 'rn-content-loader'
import {Circle, Rect} from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import StudentAPI from "modules/Classroom/api/student";

const INITIAL_STATE = { name: "", isFetching: false }

/**
 * @param {string} name 
 * @param {string} email
 */
export default class StudentListItem extends React.Component{
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
  }

  async componentDidMount(){
    this.setState({ isFetching: true });

    const { schoolId, student } = this.props;

    if(student.name){
      const { name, noInduk } = student  
      this.setState({ isFetching: false, name, noInduk });
    }else{  
      const student = await StudentAPI.getDetail(schoolId, this.props.student.id)
      if(student.gender){
        student.gender = student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
      }
      const { name, noInduk } = student  

      this.setState({ isFetching: false, name, noInduk });

    }
  }

  render(){
    if(this.state.isFetching){
      return (
        <ContentLoader style={styles.userContainer}>
          <Rect x={86} y={16} rx="4" ry="4" width={150} height={12}/>
        </ContentLoader>
      )
    }

    const { name, noInduk } = this.state;    

    return(
      <TouchableOpacity style={styles.userContainer} onPress={this.props.onPress}>
        <View>
          <Text style={{ fontWeight: "700" }}>{(noInduk)?noInduk:"-"} / {name}</Text>
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