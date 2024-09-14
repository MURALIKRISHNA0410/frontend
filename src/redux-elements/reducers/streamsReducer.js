// src/redux-elements/reducers/streamsReducer.js

// Reducer to hold all streams
// The state is an object where each key is 'who' (like local, remote1, remote2, etc.)
// and the value is the stream and peerConnection info.
export default (state = {}, action) => {
    switch (action.type) {
      case "ADD_STREAM":
        const updatedState = { ...state, [action.payload.who]: action.payload };
        console.log("State after ADD_STREAM:", updatedState); // Log the state change
        return updatedState;
  
      case "LOGOUT_ACTION":
        console.log("State reset due to LOGOUT_ACTION"); // Log reset
        return {};
  
      default:
        return state;
    }
  };
  