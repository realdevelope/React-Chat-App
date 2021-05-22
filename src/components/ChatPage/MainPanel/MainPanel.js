//setstate의 문제로 인해 function, class형식을 섞어서 작성

import React, { Component } from 'react'
import MessageHeader from './MessageHeader';
import Message from './Message';
import MessageForm from './MessageForm';
import { connect } from 'react-redux';
import firebase from '../../../firebase';
import { setUserPosts } from '../../../redux/actions/chatRoomAction';
import Skeleton from '../../../commons/components/Skeleton';

export class MainPanel extends Component {

    messageEndRef = React.createRef();

    state = {
        messages: [],
        messagesRef: firebase.database().ref("messages"),
        messagesLoading: true,
        searchTerm: "",
        searchResults: [],
        searchLoading: false,
        typingRef: firebase.database().ref("typing"),
        typingUsers: [],
        listenerLists: []
    }

    componentDidMount() {
        const { chatRoom } = this.props;

        if (chatRoom) {
            this.addMessagesListeners(chatRoom.id)
            this.addTypingListeners(chatRoom.id)
        }
    }

    //스크롤 부분
    componentDidUpdate(){   
        if(this.messageEndRef){
            this.messageEndRef.scrollIntoView({ behavior: "smooth" }) 
        }
    }

    componentWillUnmount() {
        this.state.messagesRef.off()
        this.removeListeners(this.state.listenerLists)
    }

    removeListeners =(listeners) => {
        listeners.forEach(listner => {
            listner.ref.child(listner.id).off(listner.event)
        })
    }

    addTypingListeners = (chatRoomId) => {
        let typingUsers = [];

        //typing이 새로 들어올 때
        this.state.typingRef.child(chatRoomId).on("child_added",
            DataSnapshot => {
                if (DataSnapshot.key !== this.props.user.uid) {
                    typingUsers = typingUsers.concat({
                        id: DataSnapshot.key,
                        name: DataSnapshot.val()
                    });
                    this.setState({ typingUsers })
                }
            })

            //listenerLists state에 등록된 리스너를 넣어주기
            this.addToListenerLists(chatRoomId, this.state.typingRef, "child_added")

        //typing을 지워줄 때
        this.state.typingRef.child(chatRoomId).on("child_removed",
            DataSnapshot => {
                const index = typingUsers.findIndex(user => user.id === DataSnapshot.key);
                if (index !== -1) {
                    typingUsers = typingUsers.filter(user => user.id !== DataSnapshot.key); //filter메소드 good
                    this.setState({ typingUsers })
                }
            })
            //listenerList state에 등록된 리스너를 넣어주기
            this.addToListenerLists(chatRoomId, this.state.typingRef, "child_removed")
    }  

    addToListenerLists = (id, ref, event) => {
        //이미 등록된 리스너인지 확인 
        const index = this.state.listenerLists.findIndex(listener => {
            return (
                listener.id === id &&
                listener.ref === ref &&
                listener.event === event
            );
        })

        if (index === -1) {
            const newListener = { id, ref, event }
            this.setState({
                listenerLists: this.state.listenerLists.concat(newListener)
            })
        }
    }

    handleSearchMessages = () => {
        const chatRoomMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, "gi");
        const searchResults = chatRoomMessages.reduce((acc, message) => {
            if (
                (message.content && message.content.match(regex)) ||
                message.user.name.match(regex)
            ) {
                acc.push(message)
            }
            return acc;
        }, [])
        this.setState({ searchResults })
    }

    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        },
            () => this.handleSearchMessages()
        )
    }

    addMessagesListeners = (chatRoomId) => {
        let messagesArray = [];
        this.state.messagesRef.child(chatRoomId).on("child_added", DataSnapshot => {
            messagesArray.push(DataSnapshot.val());
            this.setState({
                messages: messagesArray,
                messagesLoading: false
            })
            this.userPostsCount(messagesArray)
        })
    }

    userPostsCount = (messages) => {
        let userPosts = messages.reduce((acc, message) => {
            if(message.user.name in acc) {
                acc[message.user.name].count += 1;
            }
            else{
                acc[message.user.name] = {
                    image: message.user.image,
                    count: 1
                }
            }
            return acc;
        },{})
        this.props.dispatch(setUserPosts(userPosts))    //acc를 리턴하는 값은 메인페널에서 쓰지않고 먼저 리덕스 스토어에 넣어줘야한다!!!
    }

    renderMessages = (messages) =>
        messages.length > 0 &&
        messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.props.user}
            />
        ))

        renderTypingUsers = (typingUsers) =>
        typingUsers.length > 0 &&
        typingUsers.map(user => (
            <span>{user.name}님이 채팅을 입력하고 있습니다...</span>
        ))

        renderMessageSkeleton = (loading) =>
            loading && (
             <>
             {[0, 1, 2, 3, 4, 5, 6, 7].map((v, i) => (
                 <Skeleton key={i}></Skeleton>
             ))}
            </>
        )

        render() {
            const { messages, searchTerm, searchResults, typingUsers, messagesLoading } = this.state;
            return (
                <div style={{ padding: '2rem 2rem 0 2rem' }}>
    
                    <MessageHeader handleSearchChange={this.handleSearchChange} />
    
                    <div style={{
                        width: '100%',
                        height: '450px',
                        border: '.2rem solid #ececec',
                        borderRadius: '4px',
                        padding: '1rem',
                        marginBottom: '1rem',
                        overflowY: 'auto'
                    }}>

                    {/* 스켈레톤처리 부분  1줄*/}
                    {this.renderMessageSkeleton(messagesLoading)}

                        {searchTerm ?
                            this.renderMessages(searchResults)
                            :
                            this.renderMessages(messages)
                        }
    
                        {this.renderTypingUsers(typingUsers)}

                        <div ref={node => (this.messageEndRef = node)}>     {/*node는 div를 가르키고 messageEndRef가 div를 계속 참조 */}

                        </div>
                    </div>
    
                    <MessageForm />
    
                </div>
            )
        }
    }

    
    const mapStateToProps = state => {
        return {
            user: state.user.currentUser,
            chatRoom: state.chatRoom.currentChatRoom
        }
    }
    
    export default connect(mapStateToProps)(MainPanel)
    
