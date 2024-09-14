const initialState = {
    count: 0 // Initial state of the counter
  };
  
  const counterReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'INCREMENT_COUNTER':
        return {
          ...state,
          count: state.count + 1 // Increment the counter
        };
      default:
        return state; // Return the current state for other actions
    }
  };
  
  export default counterReducer;