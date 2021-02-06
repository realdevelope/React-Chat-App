import React, { useState, useRef } from 'react'
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/progressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import firebase from '../../../firebase';
import { useSelector } from 'react-redux';
import mime from 'mime-types';

function MessageForm() {

    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)
    const [content, setContent] = useState("")
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    const messagesRef = firebase.database().ref("messages")
    const inputOpenImageRef = useRef();
    const storageRef = firebase.storage().ref();
    const [percentage, setPercentage] = useState(0)
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)
    const typingRef = firebase.database().ref("typing");

    const handleChange = (event) => {
        setContent(event.target.value)
    }

    const createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                image: user.photoURL
            }
        }

        if (fileUrl !== null) {
            message["image"] = fileUrl;
        } 
        else {
            message["content"] = content;
        }
        return message;
    }

    const handleSubmit = async () => {
        if (!content) {
            setErrors(prev => prev.concat("Type contents first"))
            return;
        }
        setLoading(true);

        //firebase에 메시지를 저장하는 부분 
        try {
            await messagesRef.child(chatRoom.id).push().set(createMessage())

            typingRef.child(chatRoom.id).child(user.uid).remove()    //메세지를 보낸후에 타이핑 데이터를 타이핑DB에서 지울 수 있음

            setLoading(false)
            setContent("")
            setErrors([])
        } catch (error) {
            setErrors(pre => pre.concat(error.message))
            setLoading(false)
            setTimeout(() => {
                setErrors([])
            }, 5000);
        }
    }

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click()
    }

    const getPath = () => {
        if (isPrivateChatRoom) {
            return `/message/private/${chatRoom.id}`
        } else {
            return `/message/public`
        }
    }

    const handleUploadImage = (event) => {
        const file = event.target.files[0];

        const filePath = `${getPath()}/${file.name}`;
        const metadata = { contentType: mime.lookup(file.name) }
        setLoading(true)

        try{
            //파일을 먼저 스토리지에 저장
            let uploadTask = storageRef.child(filePath).put(file, metadata)   //파일을 올리는 도중에 리스너를 작동시켜야하기때문에 await를 사용x
        
            //파일 저장되는 퍼센티지 구하기 
            uploadTask.on("state_changed",
                UploadTaskSnapshot => {
                    const percentage = Math.round(
                        (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100
                    )
                    setPercentage(percentage)
                },
                err => {
                    console.error(err);
                    setLoading(false)

                },
                () => {
                    //저장이 다 된 후에 파일 메시지 전송 (데이터베이스에 저장)
                    //저장된 파일을 다운로드 받을 수 있는 URL 가져오기 
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then(downloadURL => {
                            messagesRef.child(chatRoom.id).push().set(createMessage(downloadURL))
                            setLoading(false)
                        })
                }
            )
        } 
        catch (error) {
            alert(error)
        }
    }


    const handleKeyDown = (event) => {

        //enter키로 메세지 보내는 부분
       if(event.ctrlKey && event.keyCode === 13){
           handleSubmit();
       }

        if(content) {
            typingRef.child(chatRoom.id).child(user.uid).set(user.displayName)  //타이핑 테이블에 넣음
        }
        else{
            typingRef.child(chatRoom.id).child(user.uid).remove();  //테이핑 테이블에 넣은걸 지움
        }
    }


    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                        onKeyDown={handleKeyDown}
                        value={content}
                        onChange={handleChange}
                        as="textarea"
                        rows={3} />
                </Form.Group>
            </Form>

            {
                !(percentage === 0 || percentage === 100) &&
                <ProgressBar variant="warning" label={`${percentage}%`} now={percentage} />
            }

            <div>
                {errors.map(errorMsg => <p style={{ color: 'red' }} key={errorMsg}>
                    {errorMsg}
                </p>)}
            </div>

            <Row>
                <Col>
                    <button
                        onClick={handleSubmit}
                        className="message-form-button"
                        style={{ width: '100%' }}
                        disabled={loading ? true : false}
                    >
                        SEND
                    </button>
                </Col>
                <Col>
                    <button
                        onClick={handleOpenImageRef}
                        className="message-form-button"
                        style={{ width: '100%' }}
                        disabled={loading ? true : false}
                    >
                        UPLOAD
                    </button>
                </Col>
            </Row>

            <input
                accept="image/jpeg, image/png"
                style={{ display: 'none' }}
                type="file"
                ref={inputOpenImageRef}
                onChange={handleUploadImage}
            />

        </div>
    )
}

export default MessageForm


