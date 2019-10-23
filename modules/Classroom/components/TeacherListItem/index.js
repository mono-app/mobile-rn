import React from "react";
import ContentLoader from 'rn-content-loader'
import {Circle, Rect} from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import TeacherAPI from "modules/Classroom/api/teacher";

const INITIAL_STATE = { name: "",nik: "-", isFetching: false }

/**
 * @param {string} name 
 * @param {string} email 
 */
export default class TeacherListItem extends React.Component{
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
  }

  componentDidMount(){
    this.setState({ isFetching: true });
    const { teacher } = this.props;
    const { name, nik } = teacher  
    this.setState({ isFetching: false, name, nik });
  }

  render(){
    if(this.state.isFetching){
      return (
        <ContentLoader style={styles.userContainer}>
          <Rect x={86} y={16} rx="4" ry="4" width={150} height={12}/>
        </ContentLoader>
      )
    }

    const { name,nik } = this.state;

    return(
      <TouchableOpacity style={styles.userContainer} onPress={this.props.onPress}>
        <View style={{flex: 1}}>
          <Text style={{ fontWeight: "700" }}>{(nik)?nik:"-"} / {name}</Text>
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