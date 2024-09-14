import { combineReducers } from "redux";
import callStatusReducer from "./callStatusReducer";
import streamsReducer from "./streamsReducer";
import counterReducer from "./counterReducer";
const rootReducer=combineReducers({
    callStatus:callStatusReducer,
    streams:streamsReducer,
    counter:counterReducer // demo reducer to check that is state is updating or not
})

export default rootReducer;