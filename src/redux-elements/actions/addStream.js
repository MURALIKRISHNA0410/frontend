// src/redux-elements/actions/addStream.js
export default(who, stream, peerConnection) => {
  console.log("in Add Stream Method")
    return {
      type: "ADD_STREAM",
      payload: { who, stream, peerConnection }
    };
  };
  
  
  