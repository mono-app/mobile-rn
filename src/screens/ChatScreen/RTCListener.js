import React from "react";
import Pusher from "pusher-js/react-native";
import { RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices } from "react-native-webrtc";
import { SFU_SERVER_BASE_URL, PUSHER_API_KEY, PUSHER_CLUSTER } from "react-native-dotenv";

import CurrentUserAPI from "src/api/people/CurrentUser";

export default function RTCListener(props){
  const [ stream, setStream ] = React.useState(null);
  const refPeerConneciton = React.useRef(null);
  const refPusher = React.useRef(null);

  const sendAnswer = async (answerSdp) => {
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    await fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/answer`, {
      method: "POST",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify({ answerSdp, userId: currentUserEmail })
    })
    return Promise.resolve(true);
  }

  const join = async () => {
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    const { offerSdp } = await(await fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/join`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserEmail })
    })).json()
    return Promise.resolve(offerSdp);
  }

  const renegotiate = async () => {
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    const { offerSdp } = await(await fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/renegotiate`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserEmail })
    })).json();
    return Promise.resolve(offerSdp);
  }

  const initialize = async () => {
    try{
      const offerSdp = await join();

      const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] }
      const peerConnection = new RTCPeerConnection(configuration);
      refPeerConneciton.current = peerConnection;

      const localStream = await mediaDevices.getUserMedia({ audio: true, video: false });
      peerConnection.addStream(localStream);

      peerConnection.onicecandidate = async ({ candidate }) => {
        if(candidate === null){
          const answerSdp = peerConnection.localDescription.toJSON()
          await sendAnswer(answerSdp);
          peerConnection.onicecandidate = null;
        }
      }

      const pusher = new Pusher(PUSHER_API_KEY, {
        cluster: PUSHER_CLUSTER, forceTLS: true
      });
      refPusher.current = pusher;

      const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
      const channel = pusher.subscribe("mono::rtc");
      channel.bind(`mono::addicecandidate::${props.roomId}::${currentUserEmail}`, (data) => {
        console.log(data);
      })

      peerConnection.onnegotiationneeded = (e) => console.log("negotiationneeded", e);
      peerConnection.onaddstream = (e) => { setStream(e.stream); console.log(e.stream); }
      peerConnection.ondatachannel = ({ channel }) => {
        channel.onmessage = async ({ data }) => {
          if(data === "REQ-renegotiate"){
            const offerSdp = await renegotiate();
            const offerDescription = new RTCSessionDescription(offerSdp);
            peerConnection.setRemoteDescription(offerDescription);

            const answerDescription = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answerDescription);

            const answerSdp = peerConnection.localDescription.toJSON()
            await sendAnswer(answerSdp);
          }
        }
      }
      
      const offerDescription = new RTCSessionDescription(offerSdp);
      await peerConnection.setRemoteDescription(offerDescription);

      const answerDescription = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answerDescription);
    }catch(err){ console.log(err); }
  }

  React.useEffect(() => {
    initialize();
    return async () => {
      if(refPeerConneciton.current !== null){
        await refPeerConneciton.current.close()
        const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
        await fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/leave`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserEmail })
        });
      }

      if(refPusher.current !== null) refPusher.current.disconnect();
    }
  }, [])

  return <RTCView streamURL={stream?stream.toURL():null}/>
}

RTCListener.defaultProps = { onConnected: () => {} }