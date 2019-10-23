import React from "react";
import { createAppContainer, createMaterialTopTabNavigator } from "react-navigation";
import AppHeader from "src/components/AppHeader";
import AddClassScreen from "modules/Classroom/screens/SchoolAdmin/AddClassScreen";
import AddTeacherScreen from "modules/Classroom/screens/SchoolAdmin/AddTeacherScreen";
import AddStudentScreen from "modules/Classroom/screens/SchoolAdmin/AddStudentScreen";
import { View } from "react-native";
import { withCurrentSchoolAdmin } from "modules/Classroom/api/schooladmin/CurrentSchoolAdmin";
import { withTranslation } from 'react-i18next';

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
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;

  }

  render() {
    return (
      <View style={{flex:1}}>
        <AppHeader
            navigation={this.props.navigation}
            style={{ backgroundColor: "white" }}
            title=""
          />
        <CustomTopNavigator schoolId={this.props.currentSchool.id}/>
      </View>
    );
  }
}

export default withTranslation()(withCurrentSchoolAdmin(SchoolAdminAddScreen))
