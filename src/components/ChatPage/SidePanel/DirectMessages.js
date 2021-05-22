//class 컴포넌트로 작성
import React, { Component } from 'react'
import { FaRegSmile } from 'react-icons/fa';
import firebase from '../../../firebase';
import { connect } from 'react-redux';
import { setCurrentChatRoom, setPrivateChatRoom } 
        from '../../../redux/actions/chatRoomAction';

export class DirectMessages extends Component {

    state ={
        usersRef: firebase.database().ref("users"),
        users: [],   //이니셜스테이트 공백으로 지정
        activeChatRoom: ""
    }

    componentDidMount() {
        if (this.props.user) {
            this.addUsersListeners(this.props.user.uid)
        }
    }

    addUsersListeners = (currentUserId) => {
        const { usersRef } = this.state;
        let usersArray = [];
        usersRef.on("child_added", DataSnapshot => {
            if (currentUserId !== DataSnapshot.key) {
                let user = DataSnapshot.val();
                user["uid"] = DataSnapshot.key;
                user["status"] = "offline";
                usersArray.push(user)
                this.setState({ users: usersArray })
            }
        })
    }

    renderDirectMessages = users =>
        users.length > 0 &&
        users.map(user => (
            <li key={user.uid}
                style={{
                    backgroundColor: user.uid === this.state.activeChatRoom
                        && "#ffffff45"
                }}
                onClick={() => this.changeChatRoom(user)}>
                # {user.name}
            </li>
        ))

    getChatRoomId = (userId) => {
        const currentUserId = this.props.user.uid

        return userId > currentUserId  ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`
    }

    changeChatRoom = (user) => {
        const chatRoomId = this.getChatRoomId(user.uid);
        const chatRoomData = {
            id: chatRoomId,
            name: user.name
        }

        this.props.dispatch(setCurrentChatRoom(chatRoomData));
        this.props.dispatch(setPrivateChatRoom(true));
        this.setActiveChatRoom(user.uid);
    }

    setActiveChatRoom = (userId) => {
        this.setState({ activeChatRoom: userId })
    }

    renderDirectMessages = users =>
        users.length > 0 &&
        users.map(user => (
            <li key={user.uid}
                style={{
                    backgroundColor: user.uid === this.state.activeChatRoom
                        && "#ffffff45"
                }}
                onClick={() => this.changeChatRoom(user)}>
                ㅡ {user.name}
            </li>
        ))

        render() {
            const { users } = this.state;
            return (
                <div>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <FaRegSmile style={{ marginRight: 3 }} />  DM({users.length})
                    </span>
    
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {this.renderDirectMessages(users)}
                    </ul>
                </div>
            )
        }
    }

const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(DirectMessages);