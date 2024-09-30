// src/redux-elements/reducers/callStatusReducer.js
const initState = {
    current: "idle", // 'progress', 'complete', 'negotiating'
    video: "off", // we need more than two values for feed status  "off" "enabled","disabled","complete"
    audio: "off", // Audio is off by default
    audioDevice: 'default', // Default audio device
    videoDevice: 'default', // Default video device
    shareScreen: false, // Screen sharing off by default
    haveMedia: false, // GUM (GetUserMedia) not running by default
    haveCreatedOffer:false
  };
  
  export default (state = initState, action)=>{
    if (action.type === "UPDATE_CALL_STATUS"){
        const copyState = {...state}
        copyState[action.payload.prop] = action.payload.value
        return copyState
    }else if((action.type === "LOGOUT_ACTION") || (action.type === "NEW_VERSION")){
        return initState
    }else{
        return state
    }
}
  