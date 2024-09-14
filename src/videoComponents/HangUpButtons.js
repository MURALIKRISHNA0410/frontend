// src/components/HangupButton.js
import { useDispatch, useSelector } from "react-redux";
import updateCallStatus from "../redux-elements/actions/updateCallStatus";

const HangupButton = () => {
  const dispatch = useDispatch();
  const callStatus = useSelector(state => state.callStatus); // Get the call status from Redux store

  const hangupCall = () => {
    dispatch(updateCallStatus('current', 'complete')); // Dispatch action to update call status
  };

  console.log("Current call status:", callStatus.current); // Log the current status to see the changes

  if (callStatus.current === 'complete') {
    return null; // Hide button if the call is complete
  }

  return (
    <button onClick={hangupCall} className="btn btn-danger hang-up">
      Hang Up
    </button>
  );
};

export default HangupButton;
