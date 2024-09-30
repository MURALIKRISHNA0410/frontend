// src/redux-elements/reducers/streamsReducer.js

// Reducer to hold all streams
// The state is an object where each key is 'who' (like local, remote1, remote2, etc.)
// and the value is the stream and peerConnection info.
export default (state = {}, action)=>{
  if(action.type === "ADD_STREAM"){
      const copyState = {...state};
      copyState[action.payload.who] = action.payload
      return copyState
  }else if(action.type === "LOGOUT_ACTION"){
      return {}
  }else{
      return state;
  }
}