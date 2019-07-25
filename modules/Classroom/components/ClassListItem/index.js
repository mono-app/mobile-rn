import React from "react";
import ContentLoader from 'rn-content-loader'
import {Rect} from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Paragraph } from "react-native-paper";

import ClassAPI from "../../api/class";

const INITIAL_STATE = { subject: "", info: "", isFetching: false }

/**
 * @param {string} subject 
 * @param {boolean} autoFetch - by default is `false`
 * @param {string} classId - required when `autoFetch` is `true`
 */
export default class ClassListItem extends React.Component{
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
  }

  componentDidMount(){
    const { classId, autoFetch } = this.props;

    if(autoFetch && classId){
      this.setState({ isFetching: true });
      const api = new ClassAPI();
      const promises = [ api.getDetail("1hZ2DiIYSFa5K26oTe75", classId)];

      Promise.all(promises).then(results => {
        const class_ = results[0];
        const { subject } = class_  
        const info  = class_.room+" | "+class_.academicYear+" | Semester "+class_.semester
        this.setState({ isFetching: false, subject, info });
      })
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

    let { subject,info } = this.props;
    if(this.props.autoFetch){
      subject = this.state.subject;
      info = this.state.info;
    }

    return(
      <TouchableOpacity style={styles.userContainer} onPress={this.props.onPress}>
        <View>
          <Text style={{ fontWeight: "700" }}>{subject}</Text>
          <Paragraph style={{ color: "#5E8864" }}>{info}</Paragraph>
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