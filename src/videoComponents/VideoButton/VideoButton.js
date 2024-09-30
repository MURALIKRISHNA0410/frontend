import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import startLocalVideoStream from './startLocalVideoStream'
import updateCallStatus from "../../redux-elements/actions/updateCallStatus";
import getDevices from "../../utilities/getDevices";
import addStream from "../../redux-elements/actions/addStream";
import ActionButtonDropDown from "../ActionButtonDropDown";


const VideoButton = ({ smallFeedEl }) => {

    const dispatch=useDispatch();
    const callStatus = useSelector((state) => state.callStatus);
    const streams = useSelector((state) => state.streams);
    //console.log("streams in videoButtonss",streams);
    const [pendingUpdate, setPendingUpdate]= useState(false);
    const [caretOpen,setCaretOpen] = useState(false);
    const [videoDeviceList,setVideoDeviceList] =useState([])
    const DropDown = ()=>{
       
       
    }

    useEffect(()=>{
        const getDevicesAsync = async()=>{
            if(caretOpen){
                // then we need to check for video devices
                const devices = await getDevices();
                console.log(devices.videoDevices);
                setVideoDeviceList(devices.videoDevices)
            }
        }
        getDevicesAsync()
        
    },[caretOpen])

    const changeVideoDevice = async(e)=>{
        //the user changed the desires video device
        //1.we need to get that device
        const deviceId = e.target.value
        //console.log(deviceId)
        //2.we need to getUserMedia (permission)
        const newConstraints ={
            audio: callStatus.audioDevice === "default" ? true : {deviceId:{exact:callStatus.audioDevice}},
            video:{deviceId:{exact: deviceId}}
        }
        const stream = await navigator.mediaDevices.getUserMedia(newConstraints);
        //3.update Redux with that videoDevice,and that video is enabled
        dispatch(updateCallStatus('videoDevice',deviceId));
        dispatch(updateCallStatus("video","enabled"));
        //4.update the smallFeedEl
        smallFeedEl.current.srcObject = stream;
        //5.we need to update the localStream in streams
        dispatch(addStream('localStream',stream))
        //6.add tracks
        const [videoTrack]=stream.getVideoTracks();
        //if we stop and add old tracks then its is renogotiation

        for(const s in streams){
            if(s!=='localStream'){
                //getSenders will grab all the RTCRTPsenders that the pc has
                //RTPRTC manages how tracks are sent via the pc
                const senders = streams[s].peerConnection.getSenders();
                //find the sender that is incharge of the video track
                const sender =senders.find(s=>{
                    if(s.track){
                        return s.track.kind === videoTrack.kind
                    }else{
                        return false;
                    }
                })
                sender.replaceTrack(videoTrack)
            }
        }

        

    }
    const startStopVideo = () => {
        //console.log("Have Media:", callStatus.haveMedia);
        //console.log("Local stream in VideoButton:", streams.localStream);
        //console.log("smallFeedEl", smallFeedEl.current);
        //check if video is enabled, if so disabled
        if(callStatus.video === "enabled"){
            //update redux callStatus
            dispatch(updateCallStatus('video',"disabled"));
            const tracks = streams.localStream.stream.getVideoTracks();
            tracks.forEach(t=>t.enabled = false)
        }else if(callStatus.video === "disabled"){
            //update if video is diabled ,if so enable
            //update redux callStatus
            dispatch(updateCallStatus('video',"enabled"));
            const tracks = streams.localStream.stream.getVideoTracks();
            tracks.forEach(t=>t.enabled = true)
        }else if (callStatus.haveMedia) {
            //checking if we have media if so ,start the stream
            //console.log("Setting local stream to video element.");
            smallFeedEl.current.srcObject = streams.localStream.stream;
            startLocalVideoStream(streams,dispatch)
            
            //add the tracks to the peerConnections
        } else {
            //console.log("Stream or video element is not available.");
            setPendingUpdate(true);

        }
    };

    useEffect(()=>{
        //this will run if pendingUpdate turns to true in else case
            if(pendingUpdate && callStatus.haveMedia){
                console.log('Pending update succeeded!')
                setPendingUpdate(false);
                smallFeedEl.current.srcObject = streams.localStream.stream;
                startLocalVideoStream(streams,dispatch)

            }    
    },[pendingUpdate,callStatus.haveMedia])


    return (
        <div className="button-wrapper video-button d-inline-block">
            <i className="fa fa-caret-up choose-video" onClick={()=>setCaretOpen(!caretOpen)}></i>
            <div className="button camera" onClick={startStopVideo}>
                <i className="fa fa-video"></i>
                <div className="btn-text">
                    {callStatus.video === "enabled" ? "Stop" : "Start"} Video
                </div>
            </div>
            {caretOpen ? <ActionButtonDropDown
                                 defaultValue={callStatus.videoDevice}
                                 changeHandler={changeVideoDevice}
                                 deviceList={videoDeviceList}
                                 type="video"

            /> :<></>}
        </div>
    );
};

export default VideoButton;
