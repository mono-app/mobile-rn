import React from "react";
import { createAppContainer, createMaterialTopTabNavigator } from "react-navigation";
import AppHeader from "src/components/AppHeader";
import AddClassScreen from "../AddClassScreen";
import AddTeacherScreen from "../AddTeacherScreen";
import AddStudentScreen from "../AddStudentScreen";
import { Snackbar } from "react-native-paper";
import { View, StyleSheet } from "react-native";

const INITIAL_STATE = {
  isLoading: false,
  showSnackbar: false
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

export default class SchoolAdminAddScreen extends React.PureComponent {
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

  showSnackbar() {
    this.setState({
      showSnackbar: true
    })
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.showSnackbar = this.showSnackbar.bind(this)

  }

  render() {
    return (
      <View style={{flex:1}}>
        <CustomTopNavigator showSnackbar={this.showSnackbar}/>
        <Snackbar
            visible= {this.state.showSnackbar}
            duration={Snackbar.DURATION_SHORT}
            onDismiss={() => this.setState({showSnackbar: false})}>
             foto terpilih
          </Snackbar>
      </View>
    );
  }
}
