import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import updateCounter from '../redux-elements/actions/updateCounter';

const CounterButton = () => {
  const dispatch = useDispatch();
  const count = useSelector(state => state.counter.count); // Select the count from state

  const handleIncrement = () => {
    dispatch(updateCounter()); // Dispatch action to increment the counter
  };

  return (
    <div>
      <p>Current Count: {count}</p> {/* Display the current count */}
      <button onClick={handleIncrement}>Increment</button> {/* Button to dispatch increment */}
    </div>
  );
};

export default CounterButton;