// src/components/HangupButton.js
import { useDispatch, useSelector } from "react-redux";
import updateCallStatus from "../redux-elements/actions/updateCallStatus";

const HangupButton = (largeFeedEl,smallFeedEl) => {
  const dispatch = useDispatch();
  const callStatus = useSelector(state => state.callStatus); // Get the call status from Redux store
  const streams = useSelector(state => state.streams);
  const hangupCall = () => {
    dispatch(updateCallStatus('current', 'complete')); // Dispatch action to update call 

    //user hanged up 
    for(const s in streams){
      //looping through all streams, and if there is a pc,close it
      //remove listners
      //set to nul
      if(streams[s].peerConnection){
        streams[s].peerConnection.close();
        streams[s].peerConnection.onicecandidate = null;
        streams[s].peerConnection.onaddstream = null;
        streams[s].peerConnection= null;
      }
    }
    smallFeedEl.current.srcObject = null;
    largeFeedEl.current.srcObject= null;
  };

  //console.log("Current call status:", callStatus.current); // Log the current status to see the changes

  if (callStatus.current === 'complete') {
   
    return <></>; // Hide button if the call is complete
  }

  return (
    <button onClick={hangupCall} className="btn btn-danger hang-up">
      Hang Up
    </button>
  );

  
};

export default HangupButton;
