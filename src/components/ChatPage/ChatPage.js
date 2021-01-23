import React from 'react'
import SidePanel from './SidePanel/SidePanel';
import MainPanel from './MainPanel/MainPanel';

function ChatPage() {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '300px' }}>
                <SidePanel></SidePanel>
            </div>
            <div style={{ width: '100%' }}>
                <MainPanel></MainPanel>
            </div>
            </div>
    )
}

export default ChatPage
