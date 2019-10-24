import React from "react";
import hoistNonReactStatics from 'hoist-non-react-statics';
import RoomAPI from 'src/api/rooms'
import Logger from "src/api/logger";

const CurrentRoomsContext = React.createContext();
export function withCurrentRooms(Component){
  const WrapperComponent = React.forwardRef((props, ref) => {
    return (
      <CurrentRoomsContext.Consumer>
        {(context) => 
          <Component {...props} ref={ref}
            currentRooms={context.currentRooms}
            setCurrentRooms={context.setCurrentRooms}
            getRoomDetails={context.getRoomDetails}
          
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
      setCurrentRooms: this.handleSetCurrentRooms,
      getRoomDetails: this.handleGetRoomDetails
    }
    this.handleSetCurrentRooms = this.handleSetCurrentRooms.bind(this)
  }

  handleSetCurrentRooms = (rooms) => {
    Logger.log("CurrentRoomsProvider#handleSetCurrentRooms", "");
    this.setState({currentRooms: rooms})
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
    if(room===null) room = await RoomAPI.getDetail(roomId)
    
    return room
  }


  render(){
    return (
      <CurrentRoomsContext.Provider value={this.state}>
        {this.props.children}
      </CurrentRoomsContext.Provider>
    )
  }
}

