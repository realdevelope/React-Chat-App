import { combineReducers } from 'redux';
import user from './userReducer';
import chatRoom from './chatRoomReducer';

const rootReducer = combineReducers({
    user, 
    chatRoom
})

export default rootReducer;