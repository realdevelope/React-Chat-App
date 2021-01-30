import React from 'react'
import Media from 'react-bootstrap/Media'
import moment from 'moment' //~몇분전 을 쉽게 나태낼 수 있음

function Message({ message, user }) {

    const timeFromNow = timestamp => moment(timestamp).fromNow();   //moment 에서 제공하는 fromnow()

    const isImage = message => {
        return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
    }

    const isMessageMine = (message, user) => {
        return message.user.id === user.uid
    }

    return (
        <Media style={{ marginbottom: '3px' }}>
        <img
        style={{ borderRadius: '10px'}}
          width={48}
          height={48}
          className="mr-3"
          src={ message.user.image }
          alt={ message.user.name }
        />
        <Media.Body style={{
            backgroundColor: isMessageMine(message, user) && "#ECECEC"
        }}>
          <h6>{ message.user.name }
                <span style={{ fontsize: '10px', color: 'gray'}}>
                    {timeFromNow( message.timestamp )}
                </span>
          </h6>{message.user.name}{"  "}
          {isImage(message) ? 
          <img style={{ maxWidth: '300px' }} alt="이미지" src={message.image}></img>
          : 
          <p>
            { message.content }
          </p>
        }
        </Media.Body>
      </Media>
    )
}

export default Message
