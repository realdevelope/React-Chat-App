import { SET_CURRENT_CHAT_ROOM } from './types';


export function setCurrentChatRoom(CurrentChatRoom){
 return{
     type: SET_CURRENT_CHAT_ROOM,
     payload: CurrentChatRoom
 }   
}