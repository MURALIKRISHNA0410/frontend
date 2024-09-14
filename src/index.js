import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import {createStore} from'redux';//get createstore method so thwat we can use for redux store
import {Provider} from 'react-redux';//get the Provider Component to wrap around our 
import rootReducer from './redux-elements/reducers/rootReducer';
const theStore=createStore(rootReducer);

console.log('Store created successfully:', theStore.getState()); // Log the store
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
  <Provider store={theStore}>
    <App />
    </Provider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

