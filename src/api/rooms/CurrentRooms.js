import React from "react";
import hoistNonReactStatics from 'hoist-non-react-statics';
import RoomsAPI from 'src/api/rooms'
import Logger from "src/api/logger";
import firebase from "react-native-firebase";

const CurrentRoomsContext = React.createContext();
export function withCurrentRooms(Component){
  const WrapperComponent = React.forwardRef((props, ref) => {
    return (
      <CurrentRoomsContext.Consumer>
        {(context) => 
          <Component {...props} ref={ref}
            currentRooms={context.currentRooms}
            currentBotRooms={context.currentBotRooms}
            setCurrentRooms={context.setCurrentRooms}
            getRoomDetails={context.getRoomDetails}
            setRoomNotif={context.setRoomNotif}
            roomWithNotifMap={context.roomWithNotifMap}
            unreadChatRoomList={context.unreadChatRoomList}
            unreadBotRoomList={context.unreadBotRoomList}
            clearNotifBadge={context.clearNotifBadge}
          />}

      </CurrentRoomsContext.Consumer>
    )
  })
  hoistNonReactStatics(WrapperComponent, Component);
  return WrapperComponent;
}

export class CurrentRoomsProvider extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = { 
      currentRooms: [], 
      currentBotRooms: [],
      roomWithNotifMap: {},
      unreadChatRoomList: [],
      unreadBotRoomList: [],
      setCurrentRooms: this.handleSetCurrentRooms,
      getRoomDetails: this.handleGetRoomDetails,
      setRoomNotif: this.handleSetRoomNotif,
      clearNotifBadge: this.handleClearNotifBadge,
    }
    this.currentRoomsListener = null
    this.handleSetCurrentRooms = this.handleSetCurrentRooms.bind(this)
    this.handleGetRoomDetails = this.handleGetRoomDetails.bind(this)
    this.handleSetRoomNotif = this.handleSetRoomNotif.bind(this)
    this.handleClearNotifBadge = this.handleClearNotifBadge.bind(this)
  }

  handleSetCurrentRooms = (rooms, peopleId) => {
    Logger.log("CurrentRoomsProvider#handleSetCurrentRooms", "");
    const cloneRoomWithNotifMap = JSON.parse(JSON.stringify(this.state.roomWithNotifMap))
    const cloneCurrentRooms = []
    const cloneCurrentBotRooms = []
    const cloneUnreadChatRoomList = []
    const cloneUnreadBotRoomList = []

    rooms.forEach((room) => {  
      const readBy = (room.readBy)?room.readBy:{}
      // if field read by is null or readBy not null but readBy[peopleId] is false (haven't read)
      const thereIsNotif = (readBy && readBy[peopleId]===false)
     
      cloneRoomWithNotifMap[room.id] = thereIsNotif

      if(room.type !=="bot") {
        cloneCurrentRooms.push(room)
        if(thereIsNotif) cloneUnreadChatRoomList.push(room.id)
      } else {
        cloneCurrentBotRooms.push(room)
        if(thereIsNotif) cloneUnreadBotRoomList.push(room.id)
      }
    })
  
    this.setState({currentRooms: cloneCurrentRooms, currentBotRooms: cloneCurrentBotRooms, roomWithNotifMap: cloneRoomWithNotifMap, 
      unreadChatRoomList: cloneUnreadChatRoomList, unreadBotRoomList: cloneUnreadBotRoomList})
  }

  handleGetRoomDetails = async (roomId) => {
    const rooms = JSON.parse(JSON.stringify(this.state.currentRooms))
    let room = null
    for(i=0;i<rooms.length;i++){
      if(rooms[i].id===roomId){
        room = rooms[i]
        break;
      }
    }
    if(room===null) room = await RoomsAPI.getDetail(roomId)
    
    return room
  }

  handleSetRoomNotif = async (roomId, peopleId) => {
    const cloneRoomWithNotifMap = JSON.parse(JSON.stringify(this.state.roomWithNotifMap))
    const room = await this.handleGetRoomDetails(roomId)

    const readBy = (room.readBy)?room.readBy:{}
    // if field read by is null or readBy not null but readBy[peopleId] is false (haven't read)
    if(readBy && readBy[peopleId]===false) cloneRoomWithNotifMap[roomId] =  true
    else cloneRoomWithNotifMap[roomId] = false
    
    this.setState({cloneRoomWithNotifMap})
  }

  handleClearNotifBadge = () => {
    Logger.log("CurrentRoomsProvider#handleClearNotifBadge", "");
    this.setState({unreadChatRoomList:[], unreadBotRoomList: []})
  }

  componentDidMount(){
    const currentUserId = firebase.auth().currentUser.uid;
    this.currentRoomsListener = RoomsAPI.getRoomsWithRealtimeUpdate(currentUserId, (rooms) => {
      this.handleSetCurrentRooms(rooms, currentUserId)
    });
  }

  componentWillUnmount(){
    if(this.currentRoomsListener) this.currentRoomsListener()
  }

  render(){
    return (
      <CurrentRoomsContext.Provider value={this.state}>
        {this.props.children}
      </CurrentRoomsContext.Provider>
    )
  }
}

