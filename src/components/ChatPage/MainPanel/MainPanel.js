//setstate의 문제로 인해 function, class형식을 섞어서 작성
import React, { Component } from 'react'
import Message from './Message';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';
import { connect } from 'react-redux';
import firebase from '../../../firebase';



export class MainPanel extends Component {

    state = {
        messages: [],
        messageRef: firebase.database().ref("messages"),
        messagesLoading: true
    }

    componentDidMount(){
        const { chatRoom } = this.props;
        if(chatRoom){
            this.addMessagesListeners(chatRoom.id)
        }
    }

    addMeesagesListeners = (chatRoomId) => {
        let messagesArray = [];
        this.state.messageRef.child(chatRoomId).on("child_added", DataSnapshot => {
            messagesArray.push(DataSnapshot.val());
            this.setState({
                messages: messagesArray,
                messagesLoading: false
            })
        })
    }

    renderMessages = (messages) =>
        messages.length > 0 &&
        messages.map(message => (
            <Message
                key={ message.timestamp }
                message={ message }
                user={ this.props.user }
            ></Message>
        ))

    render() {

        const { messages } = this.state;

        return (
            <div style={{ padding: '2rem 2rem 0 2rem '}}>

                <MessageHeader></MessageHeader>

                <div style={{
                    width: '100%',
                    height: '450px',
                    border: '.2rem solid #ececec',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    overflowY: 'auto'
                }}>
                    {this.renderMessages(messages)}
                </div>   

                 <MessageForm></MessageForm>
                 
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        user: state.user.currentUser,
        chatRoom: state.chatRoom.currentChatRoom
    }
}

export default connect(mapStateToProps) (MainPanel)
