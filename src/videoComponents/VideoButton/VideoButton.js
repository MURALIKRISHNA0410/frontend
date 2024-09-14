import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import startLocalVideoStream from "./startLocalVideoStream";

const VideoButton = ({ smallFeedEl }) => {


    const callStatus = useSelector((state) => state.callStatus);
    const streams = useSelector((state) => state.streams);
    const [pendingUpdate, setPendingUpdate]= useState(false);
    const dispatch=useDispatch();

    const startStopVideo = () => {
        console.log("Have Media:", callStatus.haveMedia);
        console.log("Local stream in VideoButton:", streams.localStream);
        console.log("smallFeedEl", smallFeedEl.current);

        if (callStatus.haveMedia && streams.localStream && smallFeedEl && smallFeedEl.current) {
            console.log("Setting local stream to video element.");
            smallFeedEl.current.srcObject = streams.localStream.stream;
            
            //add the tracks to the peerConnections
        } else {
            //console.log("Stream or video element is not available.");
            setPendingUpdate(true);

        }
    };

    useEffect(()=>{
        //this will run if pendingUpdate turns to true in else case
            if(pendingUpdate && callStatus.haveMedia){
                setPendingUpdate(false);
                smallFeedEl.current.srcObject = streams.localStream.stream;
            }    
    },[pendingUpdate,callStatus.haveMedia])

    useEffect(() => {
        if (callStatus.video === "display" && callStatus.haveMedia) {
            startStopVideo();
        }
    }, [callStatus.video, callStatus.haveMedia, streams]);

    return (
        <div className="button-wrapper video-button d-inline-block">
            <i className="fa fa-caret-up choose-video"></i>
            <div className="button camera" onClick={startStopVideo}>
                <i className="fa fa-video"></i>
                <div className="btn-text">
                    {callStatus.video === "display" ? "Stop" : "Start"} Video
                </div>
            </div>
        </div>
    );
};

export default VideoButton;
