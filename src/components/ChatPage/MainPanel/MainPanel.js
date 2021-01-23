//setstate의 문제로 인해 function, class형식을 섞어서 작성
import React, { Component } from 'react'
import Meessage from './Message';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';

export class MainPanel extends Component {
    render() {
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
                </div>
                 
                 <MessageForm></MessageForm>
            </div>
        )
    }
}

export default MainPanel
