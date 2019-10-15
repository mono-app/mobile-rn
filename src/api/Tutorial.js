import React from "react";
import {AsyncStorage} from 'react-native';
import hoistNonReactStatics from 'hoist-non-react-statics';

const TutorialContext = React.createContext();
export function withTutorial(Component){
  const WrapperComponent = React.forwardRef((props, ref) => {
    return (
      <TutorialContext.Consumer>
        {(context) => 
          <Component {...props} ref={ref}
            homeScreenTutorial={context.homeScreenTutorial}
            showTutorialHomeAddContact={context.showTutorialHomeAddContact}
            showTutorialHomeChatSection={context.showTutorialHomeChatSection}
            showTutorialHomeNotifSection={context.showTutorialHomeNotifSection}
        
          />}

      </TutorialContext.Consumer>
    )
  })
  hoistNonReactStatics(WrapperComponent, Component);
  return WrapperComponent;
}

export class TutorialProvider extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = { 
      homeScreenTutorial: {
        start: this.handleStartHomeScreenTutorial,
        show: (index) => this.handleShowHomeScreenTutorial(index),
        end: this.handleEndHomeScreenTutorial,
      },
      showTutorialHomeAddContact: false,
      showTutorialHomeChatSection: false,
      showTutorialHomeNotifSection: false,
    }
    this.handleStartHomeScreenTutorial = this.handleStartHomeScreenTutorial.bind(this)
    this.handleShowHomeScreenTutorial = this.handleShowHomeScreenTutorial.bind(this)
    this.handleEndHomeScreenTutorial = this.handleEndHomeScreenTutorial.bind(this)
  }

 
  handleStartHomeScreenTutorial = async () => {
    const show = await AsyncStorage.getItem('alreadyShowHomeScreenTutorial')
    if(!show){
      this.handleShowHomeScreenTutorial(1)
    }
  }


  handleShowHomeScreenTutorial = (index) => {
    if(index===1){
      this.setState({
        showTutorialHomeAddContact:true,
        showTutorialHomeChatSection:false,
        showTutorialHomeNotifSection:false
      })
    }else if(index===2){
      this.setState({
        showTutorialHomeAddContact:false,
        showTutorialHomeChatSection:true,
        showTutorialHomeNotifSection:false
      })
    }else if(index===3){
      this.setState({
        showTutorialHomeAddContact:false,
        showTutorialHomeChatSection:false,
        showTutorialHomeNotifSection:true
      })
    }
  }

  handleEndHomeScreenTutorial = async () => {
    await AsyncStorage.setItem('alreadyShowHomeScreenTutorial', "true");
    this.setState({
      showTutorialHomeAddContact:false,
      showTutorialHomeChatSection:false,
      showTutorialHomeNotifSection:false
    })
  }

  componentDidMount(){
    
  }

  componentWillUnmount(){
 
    
  }

  render(){
    return (
      <TutorialContext.Provider value={this.state}>
        {this.props.children}
      </TutorialContext.Provider>
    )
  }
}