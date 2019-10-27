import { NavigationActions, StackActions } from "react-navigation";

export default class Navigator{
  

  /**
   * 
   * @param {ReactNavigation} navigation 
   */
  constructor(navigation){
    this.navigation = navigation;
  }

  /**
   * 
   * @param {String} routeName 
   * @param {NavigationAction} actions - a redux action
   * @param {Object} options
   */
  resetTo(routeName, action=StackActions, options = {}){
    this.navigation.dispatch(action.reset({
      index: 0,
      actions: [ NavigationActions.navigate({ routeName })],
      ...options
    }))
  }

  /**
   * 
   * @param {String} routeName 
   * @param {Object} options
   */
  navigateTo(routeName, options = {}){
    this.navigation.navigate(routeName, options);
  }
}

export class StackNavigator extends Navigator{
  /**
   * 
   * @param {int} n - number of pop that you want to perform
   */
  pop(n = 1){
    const popAction = StackActions.pop({ n })
    this.navigation.dispatch(popAction);
  }

  /**
   * 
   * @param {String} routeName 
   * @param {Object} options
   */
  resetTo(routeName, options = {}){ super.resetTo(routeName, StackActions, options) }
}