import React, { useState } from 'react'

import { Avatar, IconButton } from '@material-ui/core';
import { DonutLarge, Chat, MoreVert, Search } from '@material-ui/icons';
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

});
function Sidebar() {

    const dispatch = useDispatch()
    const { handleSelectedContact } = bindActionCreators(actions, dispatch)
    const [selectedUserId, setSelectedUserId] = useState('')
    const { data: loggedInUser } = useSelector(state => state.loggedInUser)
    const { data: messages } = useSelector(state => state.savedMessages)

    const classes = useStyles();
    let { data: users } = useSelector(state => state.savedUsers)
    const [filteredUsers, setFilteredUsers] = useState(users)
    const foundIndex = users.findIndex(fi => fi.data.uid === loggedInUser.uid)
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
                    <div className="contact__name">
                        {data.contactName !== '' ? data.contactName : data.phoneNumber}
                    </div>
                    <div className="last__msg">
                        {message?.message || ''}
                    </div>

                </div>
                <div className="time_count_container">
                    <div className="lastMsg__time">
                        {moment(message?.timestamp.toDate()).format('LT') || ''}

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
    }

    return (

        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={loggedInUser?.photoURL} />
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLarge />
                    </IconButton>
                    <IconButton>
                        <Chat />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <Search />
                    <input type="text" name="" id="" placeholder="Search or start new chat" onChange={e => handleContactSearch(e.target.value)} />
                </div>
            </div>
            <div className="sidebar__contacts">
                {filteredUsers.length > 0 && filteredUsers.map((user, i) =>
                    loadContacts(user, i)
                )}

            </div>
        </div>
    )
}

export default Sidebar
