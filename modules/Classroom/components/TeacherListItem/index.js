import React from "react";
import ContentLoader from 'rn-content-loader'
import {Circle, Rect} from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";

import TeacherAPI from "../../api/teacher";

const INITIAL_STATE = { name: "", isFetching: false }

/**
 * @param {string} name 
 * @param {boolean} autoFetch - by default is `false`
 * @param {string} email - required when `autoFetch` is `true`
 */
export default class TeacherListItem extends React.Component{
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
  }

  componentDidMount(){
    const { email, autoFetch } = this.props;

    if(autoFetch && email){
      this.setState({ isFetching: true });
      const api = new TeacherAPI();
      const promises = [ api.getDetail("1hZ2DiIYSFa5K26oTe75",email)];

      Promise.all(promises).then(results => {
        const people = results[0];
        const { name } = people  
        this.setState({ isFetching: false, name });
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

    let { name } = this.props;
    if(this.props.autoFetch){
      name = this.state.name;
    }

    return(
      <TouchableOpacity style={styles.userContainer} onPress={this.props.onPress}>
        <View>
          <Text style={{ fontWeight: "700" }}>{name}</Text>
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