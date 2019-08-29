import React from "react";
import ContentLoader from 'rn-content-loader'
import {Rect} from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Paragraph } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import ClassAPI from "modules/Classroom/api/class";

const INITIAL_STATE = { subject: "", info: "", isFetching: false }

/**
 * @param {string} subject 
 * @param {string} classId
 */
export default class ClassListItem extends React.Component{
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
  }

  async componentDidMount(){
    this.setState({ isFetching: true });

    const { schoolId, class_ } = this.props;
    

    if(class_.subject){

      const { subject } = class_  
      const info  = class_.room+" | "+class_.academicYear+" | Semester "+class_.semester
      this.setState({ isFetching: false, subject, info });
    } else {
     
      const class_ = await ClassAPI.getDetail(schoolId, this.props.class_.id);
      const {subject} = class_  
      const info  = class_.room+" | "+class_.academicYear+" | Semester "+class_.semester
      this.setState({ isFetching: false, subject, info });
    
    }
  }

  render(){
    if(this.state.isFetching){
      return (
        <ContentLoader height={50}>
          <Rect x={86} y={16} rx="4" ry="4" width={150} height={12}/>
        </ContentLoader>
      )
    }

    const { subject,info } = this.state;
  
    return(
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.listItemContainer}>
          <View style={styles.listDescriptionContainer}>
            <View>
              <Text style={{ fontWeight: "700" }}>{subject}</Text>
              <Paragraph style={{ color: "#5E8864" }}>{info}</Paragraph>
            </View>
            <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864", alignSelf:"center" }}/>
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