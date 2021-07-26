import { IconButton, Avatar } from '@material-ui/core'
import React, { useRef, useState } from 'react'
import './Chat.css'
import {
    Search,
    MoreVert,
    InsertEmoticon,
    AttachFileOutlined,
    MicNoneOutlined,
    SendOutlined
} from '@material-ui/icons'

import { useDispatch, useSelector, } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import db from '../../config/firebase'
import { useEffect } from 'react'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import * as actions from '../../Redux/Action'
const useStyles = makeStyles({
    transform: {
        transform: "rotate(35deg)"
    }
});

function Chat() {
    const classes = useStyles()
    const { isContactSelected, data: selectedContact } = useSelector(state => state.selectedContact)
    const { data: loggedInUser, } = useSelector(state => state.loggedInUser)
    const { data: messages } = useSelector(state => state.savedMessages)
    const chatContainer = useRef({})
    const dispatch = useDispatch()
    const { saveMessages } = bindActionCreators(actions, dispatch)
    const [isTyping, setIsTyping] = useState(false)
    const [typedMessage, setTypedMessage] = useState('')
    // const [messages, setMessages] = useState([])
    console.log("loggedInUser", loggedInUser, 'selectedContact', selectedContact)

    useEffect(() => {
        let unsubscribe = db.collection('messages').orderBy('timestamp', 'asc')
            .onSnapshot(snapshot => (
                saveMessages(snapshot.docs.map(doc => ({
                    id: doc.id,
                    message: doc.data()
                })))
            ))
        return () => {
            unsubscribe()
        }
    }, [])

    console.log("messages=>", messages)
    const loadChatHeader = () => {
        let msgFromSelectedContact = messages?.filter(fi => fi.message?.from === selectedContact?.email)
        let lastSeen = msgFromSelectedContact.length > 0 ? moment(msgFromSelectedContact[msgFromSelectedContact.length - 1].message?.timestamp.toDate()).calendar().toLowerCase() : ''
        return (<div className="chat__header">
            <Avatar src={selectedContact.photoURL} />
            <div className="chat__header__contact__info">
                <div className="chat__header__contact__name">
                    {selectedContact?.contactName !== '' ? selectedContact?.contactName : selectedContact?.phoneNumber}
                </div>
                <div className="chat__header__last__seen">
                    {`last seen ${lastSeen}` || 'last seen'}
                </div>
            </div>
            <div className="chat__headerRight">
                <IconButton>
                    <Search />
                </IconButton>
                <IconButton>
                    <MoreVert />
                </IconButton>
            </div>
        </div>)
    }

    const handleSendButton = (event) => {
        let typedTextLength = event.target.value.length
        if (typedTextLength > 0) {
            setIsTyping(true)
            setTypedMessage(event.target.value)
        } else {
            setIsTyping(false)
            setTypedMessage('')
        }
    }

    const handleInputText = (event) => {
        event.preventDefault()
        console.log("typedMessage==> ", loggedInUser, selectedContact)
        let composedData = {
            from: loggedInUser.phoneNumber !== null ? loggedInUser.phoneNumber : loggedInUser.email,
            to: selectedContact.phoneNumber !== null ? selectedContact.phoneNumber : selectedContact.email,
            message: typedMessage,
            timestamp: new Date()
        }
        db.collection('messages').doc().set(composedData).then(() => {
            alert('message sent!')
        }).catch(error => {
            alert(error)
        })
        setTypedMessage('')
    }

    const loadChatFooter = () => {
        return (
            <div className="chat__footer">
                <IconButton>
                    <InsertEmoticon />
                </IconButton>
                <IconButton>
                    <AttachFileOutlined className={classes.transform} />
                </IconButton>
                <div className="chat__footer__textBoxContainer">
                    <form action="">
                        <input type="text" name="" placeholder="Type a message" value={typedMessage} onChange={e => handleSendButton(e)} />
                        <button type="submit" onClick={e => handleInputText(e)}></button>
                    </form>
                </div>
                <IconButton>
                    {!isTyping ? <MicNoneOutlined /> : <SendOutlined />}
                </IconButton>

            </div>
        )
    }

    const loadChatBody = () => {
        let filteredMassages = messages.filter(fi => (fi.message.from === loggedInUser.email && fi.message.to === selectedContact.email) || (fi.message.from === selectedContact.email && fi.message.to === loggedInUser.email))

        return (
            <div className="chat__body" ref={chatContainer} >

                {filteredMassages.map(msg => (
                    <p className={`chat__message ${msg.message.from === loggedInUser.email ? `chat__receiver` : ''}`}>
                        {/* <span className="chat__name">
                        Jitendra Gosavi
                    </span> */}
                        {msg.message.message}
                        <span className="chat__time">
                            {moment(msg.message.timestamp.toDate()).format('LT')}
                        </span>
                    </p>
                ))
                }
            </div >
        )
    }
    return (
        <div className="chat" >
            {isContactSelected && loadChatHeader()}
            {isContactSelected && loadChatBody()}
            {isContactSelected && loadChatFooter()}
        </div>
    )
}

export default Chat
