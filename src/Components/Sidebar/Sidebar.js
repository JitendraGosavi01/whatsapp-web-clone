import React, { useState, useRef } from 'react'

import { Avatar, IconButton, Tooltip, Zoom } from '@material-ui/core';
import { DonutLarge, Chat, MoreVert, Search, ArrowBack, } from '@material-ui/icons';
import './Sidebar.css'
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../Redux/Action'
import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/styles'
import moment from 'moment'
const useStyles = makeStyles({
    large: {
        width: '45px',
        height: '45px',
    },
    pointer: {
        cursor: 'pointer'
    }


});
function Sidebar() {
    const contactSearchTextBox = useRef({})
    const dispatch = useDispatch()
    const { handleSelectedContact } = bindActionCreators(actions, dispatch)
    const [selectedUserId, setSelectedUserId] = useState('')
    const { data: loggedInUser } = useSelector(state => state.loggedInUser)
    const { data: messages } = useSelector(state => state.savedMessages)

    const classes = useStyles();
    let { data: users } = useSelector(state => state.savedUsers)
    const [filteredUsers, setFilteredUsers] = useState(users)
    const [isContactSearching, setIsContactSearching] = useState(false)
    const [searchText, setSearchText] = useState('')
    const foundIndex = users.findIndex(fi => fi.data.email === loggedInUser.email)
    if (foundIndex > -1) {
        users.splice(foundIndex, 1)
    }


    //console.log('loggedInUser', loggedInUser)
    const handleContactSelect = (selectedUserId, data) => {

        handleSelectedContact(data)
        setSelectedUserId(selectedUserId)
    }
    const activeToggle = (index) => {
        if (users[index].id === selectedUserId) {
            return { background: '#2d3134' }
        }
    }

    const loadContacts = ({ data, id }, index) => {
        let messagesFromContacts = messages.filter(msg => msg.message.from === data.email && msg.message.to === loggedInUser.email && { ...msg.message, data })
        let { message } = messagesFromContacts.length > 0 ? messagesFromContacts[messagesFromContacts.length - 1] : {}
        return (
            <div className="contact_container" key={id} style={activeToggle(index)} onClick={e => handleContactSelect(id, data)}>
                <Avatar className={classes.large} src={data.photoURL} />

                <div className="contact__info">
                    <Tooltip TransitionComponent={Zoom} placement="right-start" title={data.contactName} aria-label={data.contactName}>
                        <div className="contact__name">
                            {data.contactName !== '' ? data.contactName : data.phoneNumber}
                        </div>
                    </Tooltip>
                    <Tooltip TransitionComponent={Zoom} placement="right-start" title={message?.message} aria-label={message?.message}>
                        <div className="last__msg">
                            {message?.message || ''}
                        </div>
                    </Tooltip>

                </div>

                <div className="time_count_container">

                    <div className="lastMsg__time">
                        {moment(message?.timestamp.toDate()).format('LT').toLowerCase() || ''}

                        {/* <p className="unread__count">
                    4
                </p> */}
                    </div>
                </div>


            </div >)
    }

    const handleContactSearch = (val) => {
        let filteredUsers = users.filter(fi => fi.data.contactName.toLowerCase().search(val) > -1)
        setFilteredUsers(filteredUsers)
        if (val) {
            setSearchText(val)
            setIsContactSearching(true)
        } else {
            setIsContactSearching(false)
            setSearchText('')
        }

    }

    const startSearch = () => {
        contactSearchTextBox.current.focus()
        setIsContactSearching(true)
    }
    const cancelSearch = () => {
        contactSearchTextBox.current.blur()
        setIsContactSearching(false)
        setSearchText('')
        handleContactSearch('')
    }

    return (

        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={loggedInUser?.photoURL} />
                <div className="sidebar__headerRight">
                    <Tooltip TransitionComponent={Zoom} placement="bottom-end" title="Status" aria-label="Status">
                        <IconButton>
                            <DonutLarge />
                        </IconButton>
                    </Tooltip>
                    <Tooltip TransitionComponent={Zoom} placement="bottom-end" title="New chat" aria-label="New chat">
                        <IconButton>
                            <Chat />
                        </IconButton>
                    </Tooltip>
                    <Tooltip TransitionComponent={Zoom} placement="bottom-end" title="Menu" aria-label="Menu">
                        <IconButton>
                            <MoreVert />
                        </IconButton>
                    </Tooltip>
                </div>
            </div >
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    {isContactSearching
                        ? <ArrowBack className={classes.pointer} onClick={cancelSearch} />
                        : <Search className={classes.pointer} onClick={startSearch} />}
                    <input type="text" value={searchText} name="" id="" placeholder="Search or start new chat" ref={contactSearchTextBox} onChange={e => handleContactSearch(e.target.value.toLocaleLowerCase())} />
                </div>
            </div>
            <div className="sidebar__contacts">
                {filteredUsers.length > 0 && filteredUsers.map((user, i) =>
                    loadContacts(user, i)
                )}
            </div>
        </div >
    )
}

export default Sidebar
