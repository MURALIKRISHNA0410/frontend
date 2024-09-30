import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import './VideoComponents.css';
import ChatWindow from "./ChatWindow";
import CallInfo from "./CallInfo";
import ActionButtons from "./ActionButton";
import addStream from "../redux-elements/actions/addStream";
import { useDispatch, useSelector } from "react-redux";
import createPeerConnection from "../utilities/createPeerConnection";
import updateCallStatus from "../redux-elements/actions/updateCallStatus";
import socketConnection from "../utilities/socketConnection";
import clientSocketListeners from "../utilities/clientSocketListeners";
const MainVideoPage = () => {

    const dispatch = useDispatch();
    const callStatus = useSelector(state=>state.callStatus)
    const streams = useSelector(state=>state.streams)
    const [searchparams, setSearchParams] = useSearchParams();
    const [apptInfo, setApptInfo] = useState({});
    const smallFeedEl = useRef(null); // Ensure this ref is correctly initialized
    const largeFeedEl = useRef(null);
    const uuidRef = useRef(null);
    const streamsRef = useRef(null);
    const [showCallInfo,setShowCallInfo] = useState(true)
    useEffect(() => {
        const fetchMedia = async () => {
            const constraints = {
                video: true,
                audio: true,
            };
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                dispatch(updateCallStatus('haveMedia', true));
                dispatch(addStream('localStream', stream));
                const { peerConnection, remoteStream } = await createPeerConnection(addIce);
                dispatch(addStream('remote1', remoteStream, peerConnection));
                console.log(remoteStream)

                largeFeedEl.current.srcObject = remoteStream //we have the remoteStream from our peer Connection set the video feed to be the rmeote stream just created
                console.log(largeFeedEl)
            } catch (err) {
                console.log(err);
            }
        };
        fetchMedia();
    }, []);


    useEffect(()=>{
        //we cannot update ref until we know 
        if(streams.remote1){
            streamsRef.current = streams;
        }
    },[streams])


    useEffect(()=>{
        const createOfferAsync = async()=>{
        
            //we have audio and video so we need an offer
            console.log("In create offer async Method")
            for(const s in streams){
                if(s!=="localStream"){
                    try{
                        const pc = streams[s].peerConnection;
                        const offer = await pc.createOffer();
                        console.log(offer)
                        pc.setLocalDescription(offer);
                        //getting the token for the socket connection
                        const token = searchparams.get('token');
                        const socket = socketConnection(token);
                        socket.emit("newOffer",{offer,apptInfo})
                        //add our event listners
                        //clientSocketListeners(socket,dispatch)
                    }catch(err){
                        console.log(err);
                    }
                }
            }
            dispatch(updateCallStatus('haveCreatedOffer',true));
        }
        if(callStatus.audio === "enabled" && callStatus.audio === "enabled" && !callStatus.haveCreatedOffer){
            createOfferAsync();
        }
    },[callStatus.audio,callStatus.video,callStatus.haveCreatedOffer]);


    useEffect(()=>{
        const asyncAddAnswer = async()=>{
        //listen for changes in callStatus.answer
        console.log("In asyncAdd ANswer Method")
            for(const s in streams){
                if(s!== "localStream"){
                    const pc = streams[s].peerConnection;
                    console.log(callStatus.answer);
                    await pc.setRemoteDescription(callStatus.answer)
                    console.log(pc.signalingState)
                    console.log("Answer added")
                }
        }
    }

    if(callStatus.answer){
        asyncAddAnswer();
    }
    },[callStatus.answer])

    useEffect(() => {
        const token = searchparams.get('token');
        console.log(token)
        const fetchDecodedToken = async () => {
            try {
                const resp = await axios.post('https://localhost:9000/validate-link', { token });
                console.log(resp.data);
                setApptInfo(resp.data);
                uuidRef.current =resp.data.uuid;
            } catch (err) {
                console.log('Error connecting to backend at axios');
            }
        };
        fetchDecodedToken();
    }, []);

    useEffect(()=>{
        const token = searchparams.get('token');
        const socket = socketConnection(token);
        clientSocketListeners(socket,dispatch,addIceCandidateToPc)
    },[])

    const addIceCandidateToPc = (iceC)=>{
        //add an ice Candiate from the remote ,to the pc
        console.log("In addIceToCandidatetopc Method")
        for(const s in streamsRef.current){
            if(s!== 'localStream'){
                const pc = streamsRef.current[s].peerConnection;
                pc.addIceCandidate(iceC);
                console.log("Added an ice candidate to lready exsisiting page ie..already exsisting client")
                setShowCallInfo(false);
            }
        }
    }

    const addIce =(iceC)=>{
        //emit a new icecandiadte to the signaling server
        console.log("In addIce Method")
        const socket = socketConnection(searchparams.get('token'));
        socket.emit('iceToServer',{
            iceC,
            who:'client',
            uuid:uuidRef.current, // used a useRef to keep the value fresh
        })

    }

    return (
        <div className="main-video-page">
            <div className="video-chat-wrapper">
                <video id="large-feed" ref={largeFeedEl} autoPlay controls playsInline></video>
                <video id="own-feed" ref={smallFeedEl} autoPlay controls playsInline></video>
                {showCallInfo ? <CallInfo apptInfo={apptInfo} /> : <></>}
                <ChatWindow />
            </div>
            <ActionButtons smallFeedEl={smallFeedEl} largeFeedEl={largeFeedEl} />
        </div>
    );
};

export default MainVideoPage;
