import React, { useState, useRef } from 'react'
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/progressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import firebase from '../../../firebase';
import { useSelector } from 'react-redux';
import mime from 'mime-types';


function MessageForm() {

    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
    const user = useSelector(state => state.user.currentUser);
    const [content, setContent] = useState("")
    const [errors, setErrors] = useState([]) // eslint-disable-next-line
    const [loading, setLoading] = useState(false)
    const messagesRef = firebase.database().ref("messages");
    const inputOpenImageRef = useRef();
    const storageRef = firebase.storage().ref();
    const [percentage, setpercentage] = useState(0)
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)

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

        if(fileUrl !== null){
            message["image"] = fileUrl;
        }
        else{
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

    const handleuploadImage = (event) => {
        const file = event.target.files[0];

        const filePath = `${getPath()}/${file.name}`;   //ㅠㅠ
        const metadata = { contentType: mime.lookup(file.name) }
        setLoading(true)

        try{
            //파일을 먼저 스토리지에 저장
            let uploadTask = storageRef.child(filePath).put(file, metadata)   //파일을 올리는 도중에 리스너를 작동시켜야하기때문에 await를 사용x
        
            //파일 저장되는 퍼센트 구하기
            uploadTask.on("state-changed", UploadTaskSnapshot => {
                const percentage = Math.round(
                    (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100     
                )
                setpercentage(percentage)
            },
            err => {
                console.error(err);
                setLoading(false)
            },
            () => {
                //저장이 다 된 후에 파일 메세지 전송 (DB에 저장)
                //저장된 파일을 다운로드 받을 수 있는 URL 가져오기
                uploadTask.snapshot.ref.getDownloadURL()
                .then(downloadURL => {
                    messagesRef.child(chatRoom.id).push().set(createMessage(downloadURL))
                    setLoading(false)
                })
            }
            )
        }
        catch (error){
            alert(error)
        }

    }

    return (
        <div>
            <Form onSubmit={ handleSubmit }>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control 
                            value={ content }
                            onChange={ handleChange }
                            as="textarea" rows={3} />
                </Form.Group>
            </Form>
            {
                !(percentage === 0 || percentage === 100) &&
                <ProgressBar variant="warning" label={`${percentage}%`} now={percentage} /> 
            }

            <div>
                {errors.map(errorMsg => <p style={{ color: 'red' }} key={ errorMsg }>
                    { errorMsg }
                </p>)}
            </div>

            <Row>
                <Col>
                    <button 
                        onClick={ handleSubmit }
                        className="message-form-button"
                        style={{ width: '100%' }}
                        disabled={loading ? true : false}>
                        SEND
                    </button>
                </Col>
                <Col>
                    <button 
                        onClick={ handleOpenImageRef }
                        className="message-form-button"
                        style={{ width: '100%' }}
                        disabled={loading ? true : false}>
                        UPLOAD
                    </button>
                </Col>
            </Row>

        <input 
            accept="image/jpeg, image/png, image/jpg"
            type="file"
            style={{ display: 'none' }}
            ref={ inputOpenImageRef }
            onChange={ handleuploadImage }>
        </input>

        </div>
    )
}

export default MessageForm
