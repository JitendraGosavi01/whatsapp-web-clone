import { IconButton, Avatar, Zoom, Tooltip } from '@material-ui/core'
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
    //accessing global state from Redux
    const { isContactSelected, data: selectedContact } = useSelector(state => state.selectedContact)
    const { data: loggedInUser, } = useSelector(state => state.loggedInUser)
    const { data: messages } = useSelector(state => state.savedMessages)
    const chatContainer = useRef({})

    //dispatch actions
    const dispatch = useDispatch()
    const { saveMessages } = bindActionCreators(actions, dispatch)
    const [isTyping, setIsTyping] = useState(false)
    const [typedMessage, setTypedMessage] = useState('')

    // const [messages, setMessages] = useState([])
    //console.log("loggedInUser", loggedInUser, 'selectedContact', selectedContact)

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

    //LOADED CHAT HANDLER
    const loadChatHeader = () => {
        //GROUPING MESSAGES FROM SENDER AND RECEIVER ONLY
        let msgFromSelectedContact = messages?.filter(fi => fi.message?.from === selectedContact?.email)
        //GETTING LAST MESSAGE AND SHOWING LAST SEEN
        let lastSeen = msgFromSelectedContact.length > 0 ? moment(msgFromSelectedContact[msgFromSelectedContact.length - 1].message?.timestamp.toDate()).calendar().toLowerCase() : ''
        return (<div className="chat__header">
            <Avatar src={selectedContact.photoURL} />
            <div className="chat__header__contact__info">
                <Tooltip TransitionComponent={Zoom} placement="bottom" title={selectedContact?.contactName} aria-label={selectedContact?.contactName} >
                    <div className="chat__header__contact__name">
                        {selectedContact?.contactName !== '' ? selectedContact?.contactName : selectedContact?.phoneNumber}
                    </div>
                </Tooltip>
                <div className="chat__header__last__seen">
                    {lastSeen && `last seen ${lastSeen}`}
                </div>
            </div>
            <div className="chat__headerRight">
                <Tooltip TransitionComponent={Zoom} placement="bottom-end" title='Search...' aria-label='Search...'>
                    <IconButton>
                        <Search />
                    </IconButton>
                </Tooltip>
                <Tooltip TransitionComponent={Zoom} placement="bottom-end" title="Menu" aria-label='Menu' >
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </Tooltip>
            </div>
        </div>)
    }

    // HANDLED ENTER KEY TO SEND MESSAGE
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

    //SENDING MESSAGE AND SAVING TO FIREBASE
    const handleInputText = (event) => {
        event.preventDefault()
        // console.log("chatContainer==> ", chatContainer.current.scrollTop = chatContainer.current.scrollHeight + 50)

        let composedData = {
            from: loggedInUser.phoneNumber !== null ? loggedInUser.phoneNumber : loggedInUser.email,
            to: selectedContact.phoneNumber !== null ? selectedContact.phoneNumber : selectedContact.email,
            message: typedMessage,
            timestamp: new Date()
        }
        db.collection('messages').doc().set(composedData).then(() => {
            //alert('message sent!')
            chatContainer.current.scrollTop = chatContainer.current.scrollHeight
            //alert(error)
        })
        //AFTER SENDING AND SAVING TO FIREBASE EMPTYING THE TEXT BOX
        setTypedMessage('')
        setIsTyping(false)
    }

    const loadChatFooter = () => {
        return (
            <div className="chat__footer">
                <Tooltip TransitionComponent={Zoom} placement="top" title='Emojis' aria-label='Emojis'>
                    <IconButton>
                        <InsertEmoticon />
                    </IconButton>
                </Tooltip>
                <Tooltip TransitionComponent={Zoom} placement="top" title='Attach' aria-label='Attach'>
                    <IconButton>
                        <AttachFileOutlined className={classes.transform} />
                    </IconButton>
                </Tooltip>
                <div className="chat__footer__textBoxContainer">
                    <form action="">
                        <input type="text" name="" placeholder="Type a message" value={typedMessage} onChange={e => handleSendButton(e)} />
                        <button type="submit" onClick={e => handleInputText(e)}></button>
                    </form>
                </div>
                {!isTyping ?
                    <Tooltip TransitionComponent={Zoom} placement="top" title='Mic' aria-label='Mic'>
                        <IconButton>
                            <MicNoneOutlined />
                        </IconButton>
                    </Tooltip> :
                    <Tooltip TransitionComponent={Zoom} placement="top" title='Send' aria-label='Send'>
                        <IconButton>
                            <SendOutlined onClick={e => handleInputText(e)} />
                        </IconButton>
                    </Tooltip>}
            </div>
        )
    }

    const loadChatBody = () => {
        //GROUPING MESSAGES FROM SENDER AND RECEIVER ONLY
        let filteredMassages = messages.filter(fi => (fi.message.from === loggedInUser.email && fi.message.to === selectedContact.email) || (fi.message.from === selectedContact.email && fi.message.to === loggedInUser.email))

        return (
            <div className="chat__body" ref={chatContainer} >

                {filteredMassages.map(msg => (
                    <p className={`chat__message ${msg.message.from === loggedInUser.email ? `chat__receiver` : 'chat__sender__border'}`}>
                        {/* <span className="chat__name">
                        Jitendra Gosavi
                    </span> */}
                        {msg.message.message}
                        <span className="chat__time">
                            {moment(msg.message.timestamp.toDate()).format('LT').toLowerCase()}
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
