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
import proSocketListeners from "../utilities/proSocketListeners";

const ProMainVideoPage = () => {

    const dispatch = useDispatch();
    const callStatus = useSelector(state=>state.callStatus)
    const streams = useSelector(state=>state.streams)
    const [searchparams, setSearchParams] = useSearchParams();
    const [apptInfo, setApptInfo] = useState({});
    const smallFeedEl = useRef(null); // Ensure this ref is correctly initialized
    const largeFeedEl = useRef(null);
    const [haveGottenIce,setHaveGottenIce] = useState(false);
    const streamsRef = useRef(null);

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
                largeFeedEl.current.srcObject = remoteStream ;
                console.log(largeFeedEl)
            } catch (err) {
                console.log(err);
            }
        };
        fetchMedia();
    }, []);

    useEffect(()=>{
            const getIceAsync = async()=>{
                console.log("In getIceAsync method")
            const socket = socketConnection(searchparams.get('token'));
            const uuid = searchparams.get('uuid')
            const icecandiadtes = await socket.emitWithAck('getIce',uuid,"professional");
            console.log("iceCandidates Received",icecandiadtes)
            icecandiadtes.forEach(iceC=>{
                for(const s in streams){
                    if(s!=='localStream'){
                        const pc =streams[s].peerConnection;
                        pc.addIceCandidate(iceC)
                        console.log('======Added Ice Candidate!!!!!!!!!!!!!')
                    }
                }
            })

        }
        if(streams.remote1 && !haveGottenIce){
            setHaveGottenIce(true);
            getIceAsync();
            streamsRef.current = streams;
        }
    },[streams,haveGottenIce])

    useEffect(()=>{
        const setAsyncOffer = async()=>{
            console.log("In setAsyncOffer method")
            for(const s in streams){
                if(s !=="localStream"){
                    const pc=streams[s].peerConnection;
                    console.log(callStatus.offer)
                    await pc.setRemoteDescription(callStatus.offer)
                    console.log(pc.signalingState) //should be have remote offer
                }
            }
        }
        if(callStatus.offer && streams.remote1 && streams.remote1.peerConnection){
            setAsyncOffer();
        }
    },[callStatus.offer,streams.remote1])

    useEffect(()=>{
        const createAnswerAsync = async()=>{
            //we have audio and video ,we can make an answer and setLocalDescrition
            console.log("In create answer async method")
            for(const s in  streams){
                if(s!=="localStream"){
                    const pc=streams[s].peerConnection;
                    //make an swer
                    const answer =await pc.createAnswer();

                    await pc.setLocalDescription(answer);
                    console.log(pc.signalingState) // should print local answer 
                    dispatch(updateCallStatus('haveCreatedAnswer',true))
                    dispatch(updateCallStatus('answer',answer))
                    //emit answer to server
                    const token = searchparams.get('token');
                    const socket =socketConnection(token)
                    const uuid = searchparams.get('uuid');
                    console.log("emitting",answer,uuid);
                    socket.emit('newAnswer',{answer,uuid})
                }
            }
        }
        //we only create an asnwer if audio and video are enabled and haveCreted answer id false
        // 
        if(callStatus.audio ==="enabled" && callStatus.video ==="enabled" && !callStatus.haveCreatedAnswer){
            createAnswerAsync()
        }
        
    },[callStatus.audio,callStatus.video,callStatus.haveCreatedAnswer])


    useEffect(() => {
        const token = searchparams.get('token');
        console.log(token)
        const fetchDecodedToken = async () => {
            try {
                const resp = await axios.post('https://localhost:9000/validate-link', { token });
                console.log(resp.data);
                setApptInfo(resp.data);
            } catch (err) {
                console.log('Error connecting to backedn for validating link');
            }
        };
        fetchDecodedToken();
    },[]);



    useEffect(()=>{
        const token = searchparams.get('token');
        const socket = socketConnection(token);
        proSocketListeners.proVideoSocketListeners(socket,addIceCandidateToPc)
    },[])

    const addIceCandidateToPc = (iceC)=>{
        //add an ice Candiate from the remote ,to the pc
        console.log("In Add Ice candidate to Pc method")
        for(const s in streamsRef.current){
            if(s!== 'localStream'){
                const pc = streamsRef.current[s].peerConnection;
                pc.addIceCandidate(iceC);
                console.log("Added an ice candidate to already exsisiting page ie..already exsisting client")
            }
        }
    }

    const addIce =(iceC)=>{
    // emit ice candiate to the server
    console.log("In Add ICe method")
        const socket = socketConnection(searchparams.get('token'))
        socket.emit('iceToServer',{
            iceC,
            who :'professional',
            uuid:searchparams.get('uuid')
        })
    }

    return (
        <div className="main-video-page">
            <div className="video-chat-wrapper">
                <video id="large-feed" ref={largeFeedEl} autoPlay controls playsInline></video>
                <video id="own-feed" ref={smallFeedEl} autoPlay controls playsInline></video>
                {callStatus.audio === "off" || callStatus.video === "off" ?
                <div className="call-info">
                    <h1>
                        {searchparams.get('client')} is in the waiting room<br />
                        call will start when audio and video is enabled
                    </h1>
                </div>:<></>
                }
                <ChatWindow />
            </div>
            <ActionButtons smallFeedEl={smallFeedEl} largeFeedEl={largeFeedEl} />
        </div>
    );
};

export default ProMainVideoPage;
