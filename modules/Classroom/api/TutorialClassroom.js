import React from "react";
import {AsyncStorage} from 'react-native';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Key from "src/helper/key"

const TutorialClassroomContext = React.createContext();
export function withTutorialClassroom(Component){
  const WrapperComponent = React.forwardRef((props, ref) => {
    return (
      <TutorialClassroomContext.Consumer>
        {(context) => 
          <Component {...props} ref={ref}
            classroomTutorial={context.classroomTutorial}
            showTutorialProfile={context.showTutorialProfile}
            showTutorialChangeProfilePic={context.showTutorialChangeProfilePic}
            resetTutorial={context.resetTutorial}
          />}

      </TutorialClassroomContext.Consumer>
    )
  })
  hoistNonReactStatics(WrapperComponent, Component);
  return WrapperComponent;
}

export class TutorialClassroomProvider extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = { 
      classroomTutorial: {
        show: (key) => this.handleShowTutorial(key),
        close: () => this.handleCloseTutorial()
      },
      showTutorialProfile: false,
      showTutorialChangeProfilePic: false,
      resetTutorial: this.handleResetTutorial,
    }
    this.handleResetTutorial = this.handleResetTutorial.bind(this)
    this.handleShowTutorial = this.handleShowTutorial.bind(this)
    this.handleCloseTutorial = this.handleCloseTutorial.bind(this)
  }

  handleResetTutorial = () => {
    AsyncStorage.setItem(Key.KEY_TUTORIAL_CLASSROOM_PROFILE,'')
    AsyncStorage.setItem(Key.KEY_TUTORIAL_CLASSROOM_CHANGE_PROFILE_PIC,'')
  }
 
  handleShowTutorial = (key) => {
    this.handleCloseTutorial()
    if(key===Key.KEY_TUTORIAL_CLASSROOM_PROFILE){
      AsyncStorage.getItem(Key.KEY_TUTORIAL_CLASSROOM_PROFILE).then(show=>{
        if(show!=="true") this.setState({showTutorialProfile:true,})
        AsyncStorage.setItem(Key.KEY_TUTORIAL_CLASSROOM_PROFILE, "true")
      })
    }else if(key===Key.KEY_TUTORIAL_CLASSROOM_CHANGE_PROFILE_PIC){
      AsyncStorage.getItem(Key.KEY_TUTORIAL_CLASSROOM_CHANGE_PROFILE_PIC).then(show=>{
        if(show!=="true") this.setState({showTutorialChangeProfilePic:true,})
        AsyncStorage.setItem(Key.KEY_TUTORIAL_CLASSROOM_CHANGE_PROFILE_PIC, "true")
      })
    }
  }

  handleCloseTutorial = ()=>{
    this.setState({
      showTutorialProfile:false,
      showTutorialChangeProfilePic:false,
    })
  }

  render(){
    return (
      <TutorialClassroomContext.Provider value={this.state}>
        {this.props.children}
      </TutorialClassroomContext.Provider>
    )
  }
}
