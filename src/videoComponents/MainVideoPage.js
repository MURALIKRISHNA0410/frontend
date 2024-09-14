import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import './VideoComponents.css';
import ChatWindow from "./ChatWindow";
import CallInfo from "./CallInfo";
import ActionButtons from "./ActionButton";
import addStream from "../redux-elements/actions/addStream";
import { useDispatch } from "react-redux";
import createPeerConnection from "../utilities/createPeerConnection";
import socket from "../utilities/socketConnection";
import updateCallStatus from "../redux-elements/actions/updateCallStatus";

const MainVideoPage = () => {
    const dispatch = useDispatch();
    const [searchparams, setSearchParams] = useSearchParams();
    const [apptInfo, setApptInfo] = useState({});
    const smallFeedEl = useRef(null); // Ensure this ref is correctly initialized
    const largeFeedEl = useRef(null);

    useEffect(() => {
        const fetchMedia = async () => {
            const constraints = {
                video: true,
                audio: false,
            };
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                dispatch(updateCallStatus('haveMedia', true));
                dispatch(addStream('localStream', stream));
                const { peerConnection, remoteStream } = await createPeerConnection();
                dispatch(addStream('remote1', remoteStream, peerConnection));
            } catch (err) {
                console.log(err);
            }
        };
        fetchMedia();
    }, [dispatch]);

    useEffect(() => {
        const token = searchparams.get('token');
        const fetchDecodedToken = async () => {
            try {
                const resp = await axios.post('https://localhost:9000/validate-link', { token });
                setApptInfo(resp.data);
            } catch (err) {
                console.log('Error connecting to backend at axios');
            }
        };
        fetchDecodedToken();
    }, [searchparams]);

    return (
        <div className="main-video-page">
            <div className="video-chat-wrapper">
                <video id="large-feed" ref={largeFeedEl} autoPlay controls playsInline></video>
                <video id="own-feed" ref={smallFeedEl} autoPlay controls playsInline></video>
                {apptInfo.professionalsFullName ? <CallInfo apptInfo={apptInfo} /> : <></>}
                <ChatWindow />
            </div>
            <ActionButtons smallFeedEl={smallFeedEl} largeFeedEl={largeFeedEl} />
        </div>
    );
};

export default MainVideoPage;
