import React from "react";
import { createAppContainer, createMaterialTopTabNavigator } from "react-navigation";
import AppHeader from "src/components/AppHeader";
import AddClassScreen from "../AddClassScreen";
import AddTeacherScreen from "../AddTeacherScreen";
import AddStudentScreen from "../AddStudentScreen";
import { View } from "react-native";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";

const INITIAL_STATE = {
  isLoading: false
};

const CustomTopNavigator = createAppContainer(
  createMaterialTopTabNavigator({
    Guru: {
      screen: AddTeacherScreen
    },
    Murid: {
      screen: AddStudentScreen
    },
    Kelas: {
      screen: AddClassScreen
    }
  },{
      tabBarOptions: {
        activeTintColor: '#000',
        inactiveTintColor: 'gray',
        style: {
            backgroundColor: 'transparent',
          },
          indicatorStyle: {
            backgroundColor: 'green',
        },
      }
  })
);

class SchoolAdminAddScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <AppHeader
          navigation={navigation}
          style={{ backgroundColor: "transparent" }}
          title=""
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;

  }

  render() {
    return (
      <View style={{flex:1}}>
        <CustomTopNavigator schoolId={this.props.currentSchool.id}/>
      </View>
    );
  }
}

export default withCurrentSchoolAdmin(SchoolAdminAddScreen)
