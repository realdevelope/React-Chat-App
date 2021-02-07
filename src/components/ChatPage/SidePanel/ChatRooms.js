import React, { Component } from 'react';
import { FaRegSmileWink } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import firebase from '../../../firebase';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';
import Badge from 'react-bootstrap/Badge';

export class ChatRooms extends Component {

    state = {
        show: false,
        name: "",
        description: "",
        chatRoomsRef: firebase.database().ref("chatRooms"),
        messagesRef: firebase.database().ref("messages"),
        chatRooms: [],
        firstLoad: true,
        activeChatRoomId: "",
        notifications: []
    }

    componentDidMount() {
        this.AddChatRoomsListeners();
    }


    componentWillUnmount() {
        this.state.chatRoomsRef.off();      //컴포넌트가 제거되었을 때 Listener도 제거

        this.state.chatRooms.forEach(chatRoom => {       //messageRef 정리
            this.state.messagesRef.child(chatRoom.id).off();
        })
    }


    setFirstChatRoom = () => {

        const firstChatRoom = this.state.chatRooms[0]
        if (this.state.firstLoad && this.state.chatRooms.length > 0) {
            this.props.dispatch(setCurrentChatRoom(firstChatRoom))
            this.setState({ activeChatRoomId: firstChatRoom.id })
        }
        this.setState({ firstLoad: false })
    }

    //알림 정보 리스너
    AddChatRoomsListeners = () => {
        let chatRoomsArray = [];

        this.state.chatRoomsRef.on("child_added", DataSnapshot => {
            chatRoomsArray.push(DataSnapshot.val());
            this.setState({ chatRooms: chatRoomsArray },
                () => this.setFirstChatRoom());
            this.addNotificationListener(DataSnapshot.key); //채팅룸 아이디를 매개변수로
        })
    }


    addNotificationListener = (chatRoomId) => {
        this.state.messagesRef.child(chatRoomId).on("value", DataSnapshot => {
            if (this.props.chatRoom) {
                this.handleNotification(    //핸들링 부분
                    chatRoomId,
                    this.props.chatRoom.id, //현재 채팅룸 아이디
                    this.state.notifications,
                    DataSnapshot
                )
            }
        })
    }


    handleNotification = (chatRoomId, currentChatRoomId, notifications, DataSnapshot) => {
        let lastTotal = 0;

        //이미 notifications state 안에 알림 정보가 들어있는 채팅방과 그렇지 않는 채팅방을 나누기
        let index = notifications.findIndex(notification =>    //findIndex : 만족할시 배열의 첫번째 요소를 반환, 만족하는 요소가 없으면 -1반환
            notification.id === chatRoomId)

        //notifications state 안에 해당 채팅방의 알림 정보가 없을때
        if(index === -1){
            notifications.push({
                id: chatRoomId,
                total: DataSnapshot.numChildren(),
                lastKnownTotal: DataSnapshot.numChildren(),
                count: 0
            })
        }
        //notifications state 안에 해당 채팅방의 알림정보가 있을때
        else{
            //상대방이 채팅 보내는 그 해당 채팅방에 있지 않을때(다른채팅방에 있을때만!!)
            if (chatRoomId !== currentChatRoomId) {
                //현재까지 유저가 확인한 총 메세지 개수
                lastTotal = notifications[index].lastKnownTotal

                //count (알림으로 보여줄 숫자)를 구하기
                //현재 총 메세지 개수 - 이전에 확인한 총 메세지 개수 > 0
                // ex) 현재 총 메세지 개수가 10개이고 이전에 확인한 메세지가 8개 였다면 2개를 알림으로 보여줌
                if (DataSnapshot.numChildren() - lastTotal > 0) {
                    notifications[index].count = DataSnapshot.numChildren() - lastTotal;
                }
            }
            //total property에 현재 전체 메세지 개수를 넣기
            notifications[index].total = DataSnapshot.numChildren();
        }

        //방 하나 하나 맞는 알림 정보를 notifications state에 넣기
        this.setState({ notifications })
    }


    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });
   
   
    handleSubmit = (e) => {
        e.preventDefault();
        const { name, description } = this.state;

        if (this.isFormValid(name, description)) {
            this.addChatRoom();
        }
    }
   
    
    addChatRoom = async () => {
        const key = this.state.chatRoomsRef.push().key;  // auto-generated key 자동으로 생성된 키를 넣어주고 그 key를 id에 넣음

        const { name, description } = this.state;
        const { user } = this.props
        const newChatRoom = {
            id: key,
            name: name,
            description: description,
            createdBY: {
                name: user.displayName,
                image: user.photoURL
            }
        }

        try {
            await this.state.chatRoomsRef.child(key).update(newChatRoom)
            this.setState({
                name: "",
                description: "",
                show: false
            })
        } catch (error) {
            alert(error)
        }
    }


    isFormValid = (name, description) =>   //유효성검사체크 - 단순하게 있기만하면!!!
        name && description;

    changeChatRoom = (room) => {
            this.props.dispatch(setCurrentChatRoom(room));
            this.props.dispatch(setPrivateChatRoom(false));
            this.setState({ activeChatRoomId: room.id })
            this.clearNotifications();
        }


    clearNotifications = () => {
        let index = this.state.notifications.findIndex(
            notification => notification.id === this.props.chatRoom.id
        )

        if(index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].lastKnownTotal = this.state.notifications[index].total;
            updatedNotifications[index].count = 0;
            this.setState({ notification: updatedNotifications })   //state에 넣어주기
        }
    }


    getNotificationCounut = (room) => {
        //해당 채팅방의 count 수를 구함
        let count = 0;

        this.state.notifications.forEach(notification => {
            if (notification.id === room.id){
                count = notification.count;
            }
        })
        if(count > 0) return count;
    }


    renderChatRooms = (chatRooms) => 
        chatRooms.length > 0 &&
        chatRooms.map(room => (
            <li key={room.id}
                style={{ backgroundColor: room.id === this.state.activeChatRoomId && "#ffffff45"}}
                onClick={() => this.changeChatRoom(room)}
             >ㅡ{room.name}
                 <Badge style={{ float: 'right', marginTop: '4px' }} variant="danger">
                    {this.getNotificationCounut(room)}  {/*알림 숫자 보여주기 */}
                </Badge>
             </li>
        ))


    render() { 
        const { chatRooms } = this.state;

        return (
            <div>
                <div style={{
                    position: 'relative',
                    
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center'
                }}> 

                    <FaRegSmileWink style={{  marginRight: 3 }}></FaRegSmileWink>
                    오픈 채팅방 {" "} ({chatRooms.length})

                    <FaPlus
                        onClick={this.handleShow} 
                        style={{
                            position: 'absolute',
                            right: 0, 
                            cursor: 'pointer'
                        }}>
                    </FaPlus>
                </div>

                    <ul style={{ 
                        listStyleType: 'none',
                        padding: 0
                        }}>

                        {this.renderChatRooms(this.state.chatRooms)}
                    </ul>


                {/* ADD CHAT ROOM MODAL */}


                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>방 만들기</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>방 이름</Form.Label>
                                <Form.Control
                                    onChange={(e) => this.setState({ name: e.target.value })}
                                    type="text" placeholder="방이름을 입력하세요" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>방 설명</Form.Label>
                                <Form.Control
                                    onChange={(e) => this.setState({ description: e.target.value })}
                                    type="text" placeholder="방에 대한 설명을 입력하세요" />
                            </Form.Group>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            닫기
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            방생성
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}

const mapStateToProps = state => {   //state에 들어있는것을 props로 바꿔서 사용
    return {
        user: state.user.currentUser,
        chatRoom: state.chatRoom.currentChatRoom
    }
}

export default connect(mapStateToProps)(ChatRooms) 

