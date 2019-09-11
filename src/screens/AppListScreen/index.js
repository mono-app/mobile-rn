import React from "react";
import { View, FlatList } from "react-native";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import { withCurrentUser } from "src/api/people/CurrentUser";
import MenuListItemWithIcon from "../../components/MenuListItemWithIcon";
import SchoolAPI from "modules/Classroom/api/school";

INITIAL_STATE = {data: []}
class AppListScreen extends React.Component{
  static navigationOptions = { headerTitle: "Aplikasi" }

  constructor(props){
    super(props)
    this.state = INITIAL_STATE
  }

  async componentDidMount(){
    let data = []
    const schoolList = await SchoolAPI.getUserSchools(this.props.currentUser.email);
    if(schoolList.length>0){
      data.push({ title: "Classroom", icon: <MaterialIcons name="class" size={24}/>, navigateTo: "Classroom" })
    }
    data.push({ title: "News", icon: <MaterialCommunityIcons name="newspaper" size={24}/>, navigateTo: "News" })
    this.setState({data})
  }
  
  render(){
    return(
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item, index }) => {
            return (
              <MenuListItemWithIcon
                key={index}
                onPress={() => this.props.navigation.navigate(item.navigateTo)}
                icon={item.icon}
                title={item.title}/>
            )
          }}/>
      </View>
    )
  }
}
export default withCurrentUser(AppListScreen);