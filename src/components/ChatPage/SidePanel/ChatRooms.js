import React, { Component } from 'react';
import { FaRegSmileWink } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import firebase from '../../../firebase';
import { setCurrentChatRoom } from '../../../redux/actions/chatRoom_action';

export class ChatRooms extends Component {

    state ={
        show: false,
        name: "",
        description: "",
        chatRoomsRef: firebase.database().ref("chatRooms"),
        chatRooms: [],
        firstLoad: true,
        activeChatRoomId: ""
    }

    componentDidMount(){
        this.AddChatRoomsListeners();   
    }

    componentWillUnmount(){
        this.state.chatRoomsRef.off();      //컴포넌트가 제거되었을 때 Listener도 제거
    }


    setFirstChatRoom = () => {
        const firstChatRoom = this.state.chatRooms[0]
        if(this.state.firstLoad && this.state.chatRooms.length > 0){
            this.props.dispatch(setCurrentChatRoom(firstChatRoom))
            this.setState({ activeChatRoomId: firstChatRoom.id })
        }
        this.setState({ firstLoad: false })
    }


    AddChatRoomsListeners = () =>{
        let chatRoomsArray = [];

        this.state.chatRoomsRef.on("child_added", DataSnapshot => {
            chatRoomsArray.push(DataSnapshot.val());
            //console.log("chatRoomsArray", chatRoomsArray)
            this.setState({ chatRooms: chatRoomsArray }, () => this.setFirstChatRoom());
        })
    }

    handleClose = () => this.setState({ show: false })
    handleShow = () => this.setState({ show: true })
    handlesubmit =(e) => {
        e.preventDefault(); //버튼을 눌렀을때 리프레쉬 되는거 막음

        const { name , description } = this.state;

        if(this.isFormValid( name, description )){
            this.addChatRoom();
        }
    }
    
    addChatRoom = async () => {
        const key = this.state.chatRoomsRef.push().key;  // auto-generated key 자동으로 생성된 키를 넣어주고 그 key를 id에 넣음

        const { name, description } = this.state;
        const { user } = this.props;
        const newChatRoom = {
            id: key,
            name: name,
            description: description,
            createdBY: {
                name: user.displayName,
                image: user.photoURL
            }
        }

        try{
            await this.state.chatRoomsRef.child(key).update(newChatRoom)
            this.setState({
                name: "",
                description: "",
                show: false
            })
        }
        catch(error){
            alert(error)
        }
    }


    isFormValid = (name, description) =>   //유효성검사체크 - 단순하게 있기만하면!!!
        name && description; 

    chageChatRoom = (room) => {
        this.props.dispatch(setCurrentChatRoom(room))
        this.setState({ activeChatRoomId: room.id })
    }

        renderChatRooms = (chatRooms) => 
        chatRooms.length > 0 &&
        chatRooms.map(room => (
            <li key={room.id}
                style={{ backgroundColor: room.id === this.state.activeChatRoomId && "#ffffff45"}}
                onClick={() => this.ChangeChatRoom(room)}
             >#{room.name}</li>
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
                    <Form onSUbmit={ this.handleSubmit }>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>방 이름</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter a chat room name"
                                onChange={(e) => this.setState({ name: e.target.value })} />    
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>방설명</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter a chat room description" 
                                onChange={( e) => this.setState({ description: e.target.value })}/>
                        </Form.Group>
                    </Form>
                    
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handlesubmit}>
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
        user: state.user.currentUser
    }
}    

export default connect(mapStateToProps)(ChatRooms)
