import React from "react";
import Logger from "src/api/logger";
import hoistNonReactStatics from 'hoist-non-react-statics';

const CurrentMessagesContext = React.createContext();
export function withCurrentMessages(Component){
  const WrapperComponent = React.forwardRef((props, ref) => {
    return (
      <CurrentMessagesContext.Consumer>
        {(context) => 
          <Component {...props} ref={ref}
            setUnreadChat={context.handleUnreadChat}
            setUnreadBot={context.handleUnreadBot}
            unreadChatRoomList={context.unreadChatRoomList}
            unreadBotRoomList={context.unreadBotRoomList}
            clearUnreadNotification={context.clearUnreadNotification}
          />}
      </CurrentMessagesContext.Consumer>
    )
  })
  hoistNonReactStatics(WrapperComponent, Component);
  return WrapperComponent;
}

export function useCurrentMessagesFunc(){
  const { handleUnreadChat, handleUnreadBot, clearUnreadNotification } = React.useContext(CurrentMessagesContext);
  return { setUnreadChat: handleUnreadChat, setUnreadBot: handleUnreadBot, clearUnreadNotification: clearUnreadNotification }
}

export class CurrentMessagesProvider extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = { 
      handleUnreadChat: this.handleUnreadChat,
      handleUnreadBot: this.handleUnreadBot,
      clearUnreadNotification: this.handleClearUnreadNotification,
      unreadChatRoomList: [],
      unreadBotRoomList: [],
    }
    this.handleUnreadBot = this.handleUnreadBot.bind(this);
    this.handleUnreadChat = this.handleUnreadChat.bind(this);
    this.clearUnreadNotification = this.handleClearUnreadNotification.bind(this);
    
  }

  handleUnreadChat = (roomId, number) => {

    let clonedChatRoomList = JSON.parse(JSON.stringify(this.state.unreadChatRoomList))

    if(number>0){
      clonedChatRoomList.push(roomId)
    }else{
      const index = clonedChatRoomList.indexOf(roomId)
      if(index!==-1){
        clonedChatRoomList.splice(index,1)
      }
    }
    Logger.log("CurrentMessagesProvider#handleUnreadChat", "");
    this.setState({unreadChatRoomList: clonedChatRoomList})
  }

  handleUnreadBot = (roomId, number) => {
    let clonedBotRoomList = JSON.parse(JSON.stringify(this.state.unreadBotRoomList))

    if(number>0){
      clonedBotRoomList.push(roomId)
    }else{
      const index = clonedBotRoomList.indexOf(roomId)
      if(index!==-1){
        clonedBotRoomList.splice(index,1)
      }
    }
    Logger.log("CurrentMessagesProvider#handleUnreadBot", "");
    this.setState({unreadBotRoomList: clonedBotRoomList})
  }

  handleClearUnreadNotification = () => {
    Logger.log("CurrentMessagesProvider#handleClearUnreadNotification", "");
    this.setState({unreadChatRoomList:[], unreadBotRoomList: []})
  }

  render(){
    return (
      <CurrentMessagesContext.Provider value={this.state}>
        {this.props.children}
      </CurrentMessagesContext.Provider>
    )
  }
}
