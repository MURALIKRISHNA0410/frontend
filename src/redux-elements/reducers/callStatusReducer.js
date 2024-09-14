// src/redux-elements/reducers/callStatusReducer.js
const initState = {
    current: "idle", // 'progress', 'complete', 'negotiating'
    video: false, // Video is off by default
    audio: false, // Audio is off by default
    audioDevice: 'default', // Default audio device
    videoDevice: 'default', // Default video device
    shareScreen: false, // Screen sharing off by default
    haveMedia: false // GUM (GetUserMedia) not running by default
  };
  
  const callStatusReducer = (state = initState, action) => {
    switch (action.type) {
      case 'UPDATE_CALL_STATUS': // Handle the action to update call status
        return {
          ...state, // Copy the previous state
          [action.payload.prop]: action.payload.value // Update only the property in the payload
        };
      case 'LOGOUT_ACTION': 
      case 'NEW_VERSION': 
        return initState; // Reset state on logout or new version
      default:
        return state; // Return the current state for any unknown actions
    }
  };
  
  export default callStatusReducer;
  