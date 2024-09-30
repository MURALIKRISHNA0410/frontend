import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionButtonDropDown from "../ActionButtonDropDown";
import getDevices from "../../utilities/getDevices";
import updateCallStatus from "../../redux-elements/actions/updateCallStatus";
import addStream from "../../redux-elements/actions/addStream";
import startAudioStream from "./startAudioStream";


const AudioButton = ({ smallFeedEl }) => {

    const dispatch = useDispatch();
    const callStatus = useSelector((state) => state.callStatus);
    const streams = useSelector((state) => state.streams);
    const [caretOpen, setCaretOpen] = useState(false);
    const [audioDeviceList, setAudioDeviceList] = useState([]);

    let micText;
    if (callStatus.audio === "off") {
        micText = "Join Audio";
    } else if (callStatus.audio === "enabled") {
        micText = "Mute";
    } else {
        micText = "Unmute";
    }

    useEffect(() => {
        const getDevicesAsync = async () => {
            if (caretOpen) {
                // Fetch audio devices when caret is open
                const devices = await getDevices();
                console.log(devices.videoDevices);
                setAudioDeviceList(
                    devices.audioOutputDevices.concat(devices.audioInputDevices)
                );
            }
        };
        getDevicesAsync();
    }, [caretOpen]);

    const startStopAudio = async () => {
        // Check if audio is enabled, if so disable it
        if (callStatus.audio === "enabled") {
            // Update Redux callStatus
            dispatch(updateCallStatus("audio", "disabled"));
            const tracks = streams.localStream.stream.getAudioTracks();
            tracks.forEach((t) => (t.enabled = false));
        } else if (callStatus.audio === "disabled") {
            // Update Redux callStatus if audio is disabled, enabling it
            dispatch(updateCallStatus("audio", "enabled"));
            const tracks = streams.localStream.stream.getAudioTracks();
            tracks.forEach((t) => (t.enabled = true));
        } else {
            // If audio was never joined, enable it by default device
            changeAudioDevice({ target: { value: "inputdefault" } });
            //add the tracks
            startAudioStream(streams);

        }
    };

    const changeAudioDevice = async (e) => {
        // Get the deviceId and the type of the device (input/output)
        const deviceId = e.target.value.slice(5);
        const audioType = e.target.value.slice(0, 5);
        console.log(e.target.value)
        // Handle audio output device change
        if (audioType === "output") {
            
                smallFeedEl.current.setSinkId(deviceId);
            
        } else if (audioType === "input") {
            // Handle audio input device change
            const newConstraints = {
                audio: { deviceId: { exact: deviceId } },
                video: callStatus.videoDevice === "default" ? true : { deviceId: { exact: callStatus.videoDevice } },
            };

            const stream = await navigator.mediaDevices.getUserMedia(newConstraints);

            // Update Redux with new audio device and set audio to enabled
            dispatch(updateCallStatus("audioDevice", deviceId));
            dispatch(updateCallStatus("audio", "enabled"));

            // Update the localStream in Redux
            dispatch(addStream("localStream", stream));

            // Replace the audio tracks with the new stream
            const [audioTrack] = stream.getAudioTracks();

            for(const s in streams){
                if(s!=='localStream'){
                    //getSenders will grab all the RTCRTPsenders that the pc has
                    //RTPRTC manages how tracks are sent via the pc
                    const senders = streams[s].peerConnection.getSenders();
                    //find the sender that is incharge of the video track
                    const sender =senders.find(s=>{
                        if(s.track){
                            return s.track.kind === audioTrack.kind
                        }else{
                            return false;
                        }
                    })
                    
                    sender.replaceTrack(audioTrack)
                    
                }
            }
            
        }
    };

    return (
        <div className="button-wrapper d-inline-block">
            <i className="fa fa-caret-up choose-audio" onClick={() => setCaretOpen(!caretOpen)}></i>
            <div className="button mic" onClick={startStopAudio}>
                <i className="fa fa-microphone"></i>
                <div className="btn-text">{micText}</div>
            </div>
            {caretOpen ? 
                <ActionButtonDropDown
                    defaultValue={callStatus.audioDevice}
                    changeHandler={changeAudioDevice}
                    deviceList={audioDeviceList}
                    type="audio"
                />
             : <></>}
        </div>
    );
};

export default AudioButton;
