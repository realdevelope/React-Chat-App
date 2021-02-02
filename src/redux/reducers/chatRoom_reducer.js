import {SET_CURRENT_CHAT_ROOM, SET_PRIVATE_CHAT_ROOM } from '../actions/types';

const initialChatRoomState = {
    currentChatRoom: null,
    isPrivateChatRoom: false
}

 // eslint-disable-next-line
export default function (state = initialChatRoomState, action) {
    switch (action.type) {
        case SET_CURRENT_CHAT_ROOM:
            return {
                ...state,
                currentChatRoom: action.payload
            }
        case SET_PRIVATE_CHAT_ROOM:
            return {
                ...state,
                isPrivateChatRoom: action.payload
            }

        default:
            return state;
    }
}


