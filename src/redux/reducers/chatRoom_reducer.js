import { SET_CURRENT_CHAT_ROOM } from '../actions/types';

const initialChatRoomState = {
    currentChatRoom: null
}

 // eslint-disable-next-line
export default function (state = initialChatRoomState, action){
    switch (action.type){
       case SET_CURRENT_CHAT_ROOM:
           return{
               ...state,
               currentChatRoom: action.payload
           }

        default:
            return state;
    }
}