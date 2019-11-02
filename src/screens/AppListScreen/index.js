import React from "react";

import AppHeader from "src/components/AppHeader";
import { View, FlatList } from "react-native";
import { default as MaterialIcons } from "react-native-vector-icons/MaterialIcons";
import { default as MaterialCommunityIcons } from "react-native-vector-icons/MaterialCommunityIcons";
import { withTranslation } from 'react-i18next';
import MenuListItemWithIcon from "src/components/MenuListItemWithIcon";
import HeadlineTitle from "src/components/HeadlineTitle";
import { withCurrentUser } from "src/api/people/CurrentUser";

function AppListScreen(props){  

  const _isMounted = React.useRef(true);
  const [ data, setData ] = React.useState([]);

  const handleItemPress = (item) => {
    const { navigateTo, params } = item;
    props.navigation.navigate(navigateTo, params);
  }

  const fetchData = async () => {
    if(_isMounted.current) setData([]);
    const list = []
    list.push({ title: "Classroom", icon: <MaterialIcons name="class" size={24}/>, navigateTo: "Classroom" })
    //list.push({ title: "News", icon: <MaterialCommunityIcons name="newspaper" size={24}/>, navigateTo: "News" })
    //list.push({ title: "People Nearby", icon: <MaterialCommunityIcons name="newspaper" size={24}/>, navigateTo: "PeopleNearby" })
    if(_isMounted.current) setData(list);
  }

  React.useEffect(() => {
    fetchData();
    return () => {
      _isMounted.current = false;
    };
  }, [])

  return(
    <View style={{ flex: 1 }}>
      <AppHeader style={{ backgroundColor: "transparent" }}/>
      <HeadlineTitle style={{ marginLeft: 16, marginRight: 16, marginTop: 8 }}>{props.t("application")}</HeadlineTitle>
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          return <MenuListItemWithIcon key={index} item={item} onPress={handleItemPress}/>
        }}/>
    </View>
  )
}
AppListScreen.navigationOptions = { header: null }
export default withTranslation()(withCurrentUser(AppListScreen))
