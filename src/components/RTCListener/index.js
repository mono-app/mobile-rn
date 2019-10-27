import React from "react";
import Pusher from "pusher-js/react-native";
import uuid from "uuid/v4";
import Logger from "src/api/logger";
import { withCurrentUser } from "src/api/people/CurrentUser";
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices } from "react-native-webrtc";
import { SFU_SERVER_BASE_URL, PUSHER_API_KEY, PUSHER_CLUSTER } from "react-native-dotenv";

import { RTCView } from "react-native-webrtc";

function RTCListener(props){
  const [ streams, setStreams ] = React.useState([]);
  const currentUserId = React.useRef(null);
  const peerConnections = React.useRef({});
  const pusher = React.useRef(null);
  const pusherChannel = React.useRef(null);
  const myToken = React.useRef(uuid())
  const listeningTo = React.useRef([]);

  const generateLog = (userId, message) => Logger.log("RTCListener", `${myToken.current} ${userId}: ${message}`)
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

  const closePeerConnection = async (userId) => {
    if(peerConnections.current[userId] === undefined) return;
    generateLog(userId, `closing`);
    await peerConnections.current[userId].pc.close();
    delete peerConnections.current[userId];
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
    generateLog(currentUserId.current, "initializing pusher");
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

      // assuming that I am not listening to this publisher, no need to remove the publisher from my subscription list
      if(peerConnections.current[publisherId] === undefined) return;
      if(publisherId === currentUserId.current) return ;

      peerConnections.current[publisherId].pc.close();
      listeningTo.current.splice(listeningTo.current.indexOf(publisherId));
      delete peerConnections.current[publisherId];
      generateLog(currentUserId.current, `publisher ${publisherId} is leaving`);
    })
  }

  const initPublisher = async () => {
    generateLog(currentUserId.current, "initializing publisher");
    await createPeerConnection(currentUserId.current);

    const localStream = await mediaDevices.getUserMedia({ audio: true, video: false });
    peerConnections.current[currentUserId.current].pc.addStream(localStream);
  }

  const initSubscribers = async () => {
    generateLog(currentUserId.current, "initializing subscribers");
    pusherChannel.current.bind(`mono::newpublishers::${props.roomId}`, (data) => {
      generateLog(currentUserId.current, "a new publisher event is triggering");
      const { publishers } = data;
      startListening(publishers);
    })

    const { publishers } = await (await fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/publishers`, { method: "GET" })).json()
    startListening(publishers);
  }

  const initMain = async () => {
    currentUserId.current = JSON.parse(JSON.stringify(props.currentUser.id));
    await initPusher();
  }

  const startListening = (publishers) => {
    const selectedPublishers = publishers.filter((publisherId) => publisherId !== currentUserId.current);
    generateLog(currentUserId.current, `got ${publishers.length} publishers, and selected only ${selectedPublishers.length}`);
    selectedPublishers.forEach((publisherId) => {
      if(listeningTo.current.includes(publisherId)){
        generateLog(currentUserId.current, `already listening to ${publisherId}, ignoring`)
        return;
      }
      listeningTo.current.push(publisherId);
      generateLog(currentUserId.current, `generating RTCPeerConnection for ${publisherId}`);
      createPeerConnection(publisherId).then(() => {
        fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/subscribe`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: myToken.current, userId: publisherId })
        })
      });
    })
  }

  const stopPublishing = async () => {
    if(peerConnections.current[currentUserId.current] === undefined) return;
    generateLog(currentUserId.current, "stop publishing the stream");
    await fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/publisher`, {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserId.current, token: myToken.current })
    })
    await closePeerConnection(currentUserId.current);
  }

  const stopListening = async () => {
    const subscribers = Object.keys(peerConnections.current).filter((userId) => userId !== currentUserId.current);
    generateLog(currentUserId.current, `Having ${subscribers.length} to unsubscribe`);
    const subscriberPromises = subscribers.map(async (userId) => {
      listeningTo.current.splice(listeningTo.current.indexOf(userId));
      await fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/subscribe`, {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token: myToken.current })
      })
      await closePeerConnection(userId)
    })
    await Promise.all(subscriberPromises)
  }


  React.useEffect(() => {
    initMain()
    return function cleanup(){
      if(pusher.current) pusher.current.disconnect()

      fetch(`${SFU_SERVER_BASE_URL}/conversation/${props.roomId}/leave`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId.current, token: myToken.current })
      })

      Object.keys(peerConnections.current).forEach((userId) => closePeerConnection(userId))
    }
  }, [])

  React.useEffect(() => {
    if(props.isPublisher) initPublisher();
    else stopPublishing();
  }, [ props.isPublisher ])

  React.useEffect(() => {
    if(props.isSubscriber) initSubscribers();
    else stopListening();
  }, [ props.isSubscriber ])

  generateLog(currentUserId.current, SFU_SERVER_BASE_URL)
  return streams.map((stream, index) => <RTCView key={index} streamURL={stream?stream.toURL():null}/>)
}

RTCListener.defaultProps = { onConnected: () => {} }
export default withCurrentUser(RTCListener);