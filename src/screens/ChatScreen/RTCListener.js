import React from "react";
import Pusher from "pusher-js/react-native";
import uuid from "uuid/v4";
import { RTCPeerConnection, RTCSessionDescription, RTCView, RTCIceCandidate, mediaDevices } from "react-native-webrtc";
import { SFU_SERVER_BASE_URL, PUSHER_API_KEY, PUSHER_CLUSTER } from "react-native-dotenv";

import CurrentUserAPI from "src/api/people/CurrentUser";

export default function RTCListener(props){
  const [ streams, setStreams ] = React.useState([]);
  const currentUserEmail = React.useRef(null);
  const peerConnections = React.useRef({});
  const pusher = React.useRef(null);
  const pusherChannel = React.useRef(null);
  const myToken = React.useRef(uuid())
  const listeningTo = React.useRef([]);

  const generateLog = (userId, message) => console.log(`${myToken.current} ${userId}: ${message}`)

  const negotiate = async (userId) => {
    generateLog(userId, "negotation start");
    const { offerSdp } = await (await fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/join`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: myToken.current, userId })
    })).json();

    await peerConnections.current[userId].pc.setRemoteDescription(new RTCSessionDescription(offerSdp));
    const answerSdp = await peerConnections.current[userId].pc.createAnswer();
    await peerConnections.current[userId].pc.setLocalDescription(answerSdp);
    await fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/answer`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        answerSdp: peerConnections.current[userId].pc.localDescription.toJSON(),  userId, token: myToken.current
      })
    })
    generateLog(userId, "negotiation complete");
  }

  const createPeerConnection = async (userId) => {    
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] }
    peerConnections.current[userId] = { 
      pc: new RTCPeerConnection(configuration), 
      iceCandidates: []
    }

    peerConnections.current[userId].pc.onnegotiationneeded = () => { 
      generateLog(userId, "re-negotiation needed");
      negotiate(userId); 
    }

    peerConnections.current[userId].pc.onicecandidate = ({ candidate }) => {
      if(candidate !== null){
        fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/trickleIce`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ iceCandidate: candidate, userId, token: myToken.current })
        })
      }
    };

    peerConnections.current[userId].pc.onaddstream = (e) => {
      const clonedStreams = [...streams];
      clonedStreams.push(e.stream);
      setStreams(clonedStreams);
    }

    peerConnections.current[userId].pc.oniceconnectionstatechange = () => {
      if(peerConnections.current[userId] === undefined) return;
      generateLog(userId, `iceConnectionState - ${peerConnections.current[userId].pc.iceConnectionState}`)
      if(peerConnections.current[userId].pc.iceConnectionState === "connected" && peerConnections.current[userId].pc.remoteDescription){
        generateLog(userId, `having ${peerConnections.current[userId].iceCandidates.length} RTCIceCandidate`)
        while(peerConnections.current[userId].iceCandidates.length > 0){
          const candidate = new RTCIceCandidate(peerConnections.current[userId].iceCandidates.pop());
          peerConnections.current[userId].pc.addIceCandidate(candidate).then(() => {
            generateLog(userId, `RTCIceCandidate has been added`)
          }).catch((err) => console.log(`${userId}: iceCandidate failed - ${err}`));
        }
      }
    }

    await negotiate(userId);
  }

  const initPusher = () => {
    generateLog(currentUserEmail.current, "initializing pusher");
    pusher.current = new Pusher(PUSHER_API_KEY, { cluster: PUSHER_CLUSTER, forceTLS: true });
    pusherChannel.current = pusher.current.subscribe("mono.rtc");
    pusherChannel.current.bind(`mono::addicecandidate::${props.roomId}::${myToken.current}`, (data) => {
      peerConnections.current[data.userId].iceCandidates.push(data.candidate);
      generateLog(data.userId, `queueing RTCIceCandidate ${peerConnections.current[data.userId].iceCandidates.length}`);
    });

    pusherChannel.current.bind(`mono::renegotiate::${props.roomId}::${myToken.current}`, (data) => {
      const { userId } = data;
      negotiate(userId);
    });

    pusherChannel.current.bind(`mono::leavingpublisher::${props.roomId}`, (data) => {
      const { publisherId } = data;
      if(publisherId === currentUserEmail.current) return ;
      peerConnections.current[publisherId].pc.close();
      listeningTo.current.splice(listeningTo.current.indexOf(publisherId));
      delete peerConnections.current[publisherId];
      generateLog(currentUserEmail.current, `publisher ${publisherId} is leaving`);
    })
  }

  const initPublisher = async () => {
    generateLog(currentUserEmail.current, "initializing publisher");
    await createPeerConnection(currentUserEmail.current);

    const localStream = await mediaDevices.getUserMedia({ audio: true, video: false });
    peerConnections.current[currentUserEmail.current].pc.addStream(localStream);
  }

  const initSubscribers = async () => {
    generateLog(currentUserEmail.current, "initializing subscribers");
    pusherChannel.current.bind(`mono::newpublishers::${props.roomId}`, (data) => {
      generateLog(currentUserEmail.current, "a new publisher event is triggering");
      const { publishers } = data;
      const selectedPublishers = publishers.filter((publisherId) => publisherId !== currentUserEmail.current);
      generateLog(currentUserEmail.current, `got ${publishers.length} publishers, and selected only ${selectedPublishers.length}`);
      selectedPublishers.forEach((publisherId) => {
        if(listeningTo.current.includes(publisherId)) return;
        listeningTo.current.push(publisherId);
        generateLog(currentUserEmail.current, `generating RTCPeerConnection for ${publisherId}`);
        createPeerConnection(publisherId).then(() => {
          fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/subscribe`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: myToken.current, userId: publisherId })
          })
        });
      })
    })
  }

  const initMain = async () => {
    currentUserEmail.current = await CurrentUserAPI.getCurrentUserEmail();
    await initPusher();
    await initPublisher();
    await initSubscribers();
  }

  React.useEffect(() => {
    initMain()
    return function cleanup(){
      if(pusher.current) pusher.current.disconnect()

      fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/leave`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserEmail.current, token: myToken.current })
      })

      Object.keys(peerConnections.current).forEach((userId) => {
        generateLog(userId, `closing`);
        peerConnections.current[userId].pc.close();
        delete peerConnections.current[userId];
      })
    }
  }, [])

  return streams.map((stream, index) => <RTCView key={index} streamURL={stream?stream.toURL():null}/>)
}

RTCListener.defaultProps = { onConnected: () => {} }