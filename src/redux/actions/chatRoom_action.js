import { SET_CURRENT_CHAT_ROOM, SET_PRIVATE_CHAT_ROOM } from './types';

export function setCurrentChatRoom(currentChatRoom) {
    return {
        type: SET_CURRENT_CHAT_ROOM,
        payload: currentChatRoom
    }
}

export function setPrivateChatRoom(isPrivateChatRoom) {
    return {
        type: SET_PRIVATE_CHAT_ROOM,
        payload: isPrivateChatRoom
    }
}
