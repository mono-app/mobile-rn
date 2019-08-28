import React from "react";
import firebase from "react-native-firebase";
import io from "socket.io-client";;
import { Dimensions, View } from "react-native";
import { 
  RTCIceCandidate, RTCSessionDescription, RTCPeerConnection, RTCView, mediaDevices 
} from "react-native-webrtc";

const INITIAL_STATE = { stream: null }

export default class WebRTCScreen extends React.PureComponent{
  constructor(props){
    super(props);

    this.peerConnection = null;
    this.state = INITIAL_STATE;
  }

  async componentDidMount(){
    const localStream = await mediaDevices.getUserMedia({ audio: true, video: false });

    // send offer to firebase database
    const role = "offer";
    const roomId = "aW6jvLZ7p6Z6h9evbNG5"
    const configuration = { iceServers: [{ url: "stun:stun.l.google.com:19302" }] };

    const roomSocket = io("http://192.168.1.72:1357/rooms");
    roomSocket.on("test", (data) => console.log(data));
    roomSocket.on("connect", async () => {
      roomSocket.emit("join", roomId);

      this.peerConnection = new RTCPeerConnection(configuration);
      this.peerConnection.addStream(localStream);
      this.peerConnection.onaddstream = (event) => this.setState({ stream: event.stream });
      this.peerConnection.onicecandidate = (event) => {
        roomSocket.emit("offer.iceCandidate", event.candidate);
      }

      const offerDescription = await this.peerConnection.createOffer({ offerToReceiveVideo: true });
      await this.peerConnection.setLocalDescription(offerDescription);
      roomSocket.emit("offer.description", offerDescription.toJSON());
    });

    roomSocket.on("answer.description", async (description) => {
      const answerDescription = new RTCSessionDescription(description);
      await this.peerConnection.setRemoteDescription(answerDescription);
    })

    roomSocket.on("answer.iceCandidate", async (candidate) => {
      if(candidate){
        const iceCandidate = new RTCIceCandidate(candidate);
        await this.peerConnection.addIceCandidate(iceCandidate);
      }
    })
  }

  componentWillUnmount(){ if(this.peerConnection) this.peerConnection.close(); }

  render(){
    if(this.state.stream === null) return null;
    else {
      return (
        <View style={{ flex: 1, backgroundColor: "red" }}>
          <RTCView streamURL={this.state.stream.toURL()} objectFit="cover" mirror={true} style={{ flex: 1, width: Dimensions.get("window").width, backgroundColor: "blue" }}/>
        </View>
      )
    }
  }
}