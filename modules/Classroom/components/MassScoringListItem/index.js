import React from "react";
import ContentLoader from 'rn-content-loader'
import { Rect } from 'react-native-svg'
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { default as EvilIcons } from "react-native-vector-icons/EvilIcons";
import StudentAPI from "../../api/student";

const INITIAL_STATE = { name: "", isFetching: false }

/**
 * @param {string} name 
 * @param {string} email
 */
export default class MassScoringListItem extends React.PureComponent{
  constructor(props){
    super(props);

    this.state = INITIAL_STATE;
  }

  async componentDidMount(){
    this.setState({ isFetching: true });

    const { schoolId, student } = this.props;

    this.setState({finalScore: student.finalScore})

    if(student.name){
      const { name, noInduk, finalScore } = student  
      this.setState({ isFetching: false, name, noInduk, finalScore });
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
    let finalScore = ""
    const name = this.state.name;
    const noInduk = this.state.noInduk;
    if(this.state.finalScore!=""){
      finalScore = this.state.finalScore;
    }
    
    return(
     
      <TouchableOpacity onPress={this.props.onPress} disabled={this.state.finalScore}>
        <View style={styles.listItemContainer}>
          <View style={styles.listDescriptionContainer}>
            <Text style={styles.label}>{(noInduk)?noInduk:"-"} / {name}</Text>
            <View style={{flexDirection:"row",textAlign: "right"}}>
              <Text>{finalScore}</Text>
              {(this.state.finalScore)? 
              <View/>
              : 
              <EvilIcons name="chevron-right" size={24} style={{ color: "#5E8864" }}/>}
            </View>
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
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE8",
    backgroundColor: "white",
    flexDirection: "row",
    padding: 16,
    alignItems: "center"
  },
  listDescriptionContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  label: {
    fontWeight: "normal"
  }
})