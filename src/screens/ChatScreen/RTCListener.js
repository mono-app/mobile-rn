import React from "react";
import Pusher from "pusher-js/react-native";
import { RTCPeerConnection, RTCSessionDescription, RTCView, RTCIceCandidate, mediaDevices } from "react-native-webrtc";
import { SFU_SERVER_BASE_URL, PUSHER_API_KEY, PUSHER_CLUSTER } from "react-native-dotenv";

import CurrentUserAPI from "src/api/people/CurrentUser";

export default function RTCListener(props){
  const [ stream, setStream ] = React.useState(null);
  const refLocalStream = React.useRef(null);
  const refPeerConnection = React.useRef(null);
  const refPusher = React.useRef(null);
  const refIceCandidates = React.useRef([]);

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
  
  const negotiate = async (peerConnection) => {
    const offerSdp = await join();
    const offerDescription = new RTCSessionDescription(offerSdp);
    await peerConnection.setRemoteDescription(offerDescription);

    const answerDescription = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answerDescription);
    const answerSdp = peerConnection.localDescription.toJSON();
    await sendAnswer(answerSdp);
  }

  const initializePusher = async (peerConnection) => {
    const pusher = new Pusher(PUSHER_API_KEY, { cluster: PUSHER_CLUSTER, forceTLS: true });
    refPusher.current = pusher;
    
    const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
    const channel = pusher.subscribe("mono.rtc");
    channel.bind(`mono::renegotiate::${props.roomId}::${currentUserEmail}`, () => {
      console.log("got negotation request from server");
      negotiate(peerConnection);
    })

    channel.bind(`mono::addicecandidate::${props.roomId}::${currentUserEmail}`, (data) => {
      try{
        const { candidate } = data;
        refIceCandidates.current.push(candidate);
        console.log(`saving iceCandidate to queue, will be used after get remoteConnection. Total iceCandidates in queue is ${refIceCandidates.current.length}`);
      }catch(err){ console.log(err); }
    });
  }

  const initialize = async () => {
    try{
      const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] }
      const peerConnection = new RTCPeerConnection(configuration);
      refPeerConnection.current = peerConnection;
      await initializePusher(peerConnection);

      refLocalStream.current = await mediaDevices.getUserMedia({ audio: true, video: false });
      peerConnection.addStream(refLocalStream.current);

      peerConnection.onicecandidate = async ({ candidate }) => {
        if(candidate !== null){
          console.log("sending ice candidate to remote");
          const currentUserEmail = await CurrentUserAPI.getCurrentUserEmail();
          await fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/trickleIce`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: currentUserEmail, iceCandidate: candidate })
          })
        }
      }

      peerConnection.onremovestream = () => { setStream(null); console.log("A stream has been removed") }
      peerConnection.onaddstream = (e) => { 
        e.stream.onaddtrack = () => console.log("Testing");
        setStream(e.stream); console.log("A stream has been added"); 
      }

      peerConnection.onnegotiationneeded = () => { negotiate(peerConnection); console.log("nego needed") }
      peerConnection.oniceconnectionstatechange = () => {
        console.log(`iceConnectionState: ${peerConnection.iceConnectionState}`)
        if(peerConnection.iceConnectionState === "connected" && peerConnection.remoteDescription){
          // add iceCandidate in queue if any
          while(refIceCandidates.current.length > 0){
            const candidate = refIceCandidates.current.pop();
            const iceCandidate = new RTCIceCandidate(candidate);
            peerConnection.addIceCandidate(iceCandidate).then(() => {
              console.log("iceCandidate has been added");
            }).catch((err) => console.log(err));
          }
        }
      }
    }catch(err){ console.log(err); }
  }

  React.useEffect(() => {
    initialize();
    return async () => {
      if(refPeerConnection.current !== null){
        await refPeerConnection.current.close()
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