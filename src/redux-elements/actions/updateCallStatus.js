// src/redux-elements/actions/updateCallStatus.js
const updateCallStatus = (prop, value) => {
    return {
      type: 'UPDATE_CALL_STATUS',
      payload: { prop, value } // The payload contains the property to update and its new value
    };
  };
  
  export default updateCallStatus;
  