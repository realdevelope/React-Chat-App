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
        this.state.chatRooms.off();      //컴포넌트가 제거되었을 때 Listener도 제거
    }


    setFirstChatRoom = () => {

        const firstChatRoom = this.state.chatRooms[0]
        if (this.state.firstLoad && this.state.chatRooms.length > 0) {
            this.props.dispatch(setCurrentChatRoom(firstChatRoom))
            this.setState({ activeChatRoomId: firstChatRoom.id })
        }
        this.setState({ firstLoad: false })
    }


    AddChatRoomsListeners = () => {
        let chatRoomsArray = [];

        this.state.chatRoomsRef.on("child_added", DataSnapshot => {
            chatRoomsArray.push(DataSnapshot.val());
            this.setState({ chatRooms: chatRoomsArray },
                () => this.setFirstChatRoom());
            this.addNotificationListener(DataSnapshot.key);
        })
    }


    addNotificationListener = (chatRoomId) => {
        this.state.messagesRef.child(chatRoomId).on("value", DataSnapshot => {
            if (this.props.chatRoom) {
                this.handleNotification(
                    chatRoomId,
                    this.props.chatRoom.id,
                    this.state.notifications,
                    DataSnapshot
                )
            }
        })
    }


    handleNotification = () => {

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
            createdBy: {
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
        }

        renderChatRooms = (chatRooms) => 
        chatRooms.length > 0 &&
        chatRooms.map(room => (
            <li key={room.id}
                style={{ backgroundColor: room.id === this.state.activeChatRoomId && "#ffffff45"}}
                onClick={() => this.changeChatRoom(room)}
             >#{room.name}
                 <Badge style={{ float: 'right', marginTop: '4px' }} variant="danger">
                    1
                </Badge>
             </li>
        ))

    render() { 
        return (
            <div>
                <div style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center'
                }}> 

                    <FaRegSmileWink style={{  marginRight: 3 }}></FaRegSmileWink>
                    CHAT ROOMS {" "}(1)

                    <FaPlus
                    onClick={this.handleShow} 
                    style={{
                        position: 'absolute',
                        right: 0, 
                        cursor: 'pointer'
                    }}></FaPlus>
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
                        <Modal.Title>Create a chat room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>방 이름</Form.Label>
                                <Form.Control
                                    onChange={(e) => this.setState({ name: e.target.value })}
                                    type="text" placeholder="Enter a chat room name" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>방 설명</Form.Label>
                                <Form.Control
                                    onChange={(e) => this.setState({ description: e.target.value })}
                                    type="text" placeholder="Enter a chat room description" />
                            </Form.Group>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Create
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

