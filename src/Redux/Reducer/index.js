import { combineReducers } from 'redux'
import { types } from '../Action';

const initialState = {
    selectedContact: { isContactSelected: false, data: {} },
    searchContact: { isSearching: false, data: {} },
    savedUsers: { data: [] },
    loggedInUser: { isLoggedIn: false, data: {} },
    savedMessages: { data: [] }
}


const selectContactReducer = (state = initialState.chatWindow, action) => {
    switch (action.type) {
        case types.IS_CONTACT_SELECTED:
            return { ...state, isContactSelected: true, data: action.data }
        default:
            return Object.assign({}, state);
    }

}

const saveUsersReducer = (state = initialState.savedUsers, action) => {
    switch (action.type) {
        case types.SAVE_USERS:
            return { ...state, data: action.data }
        default:
            return { ...state }
    }
}



const searchContactReducer = (state = initialState.searchContact, action) => {
    return (action.type === types.SEARCH_CONTACT)
        ? { isSearching: true, data: action.data }
        : state
}

const setLoggedInUserReducer = (state = initialState.loggedInUser, action) => {
    switch (action.type) {
        case types.SET_LOGGED_IN_USER:
            return { ...state, isLoggedIn: true, data: action.data }
        default:
            return { ...state }
    }

}

const saveMessagesReducer = (state = initialState.savedMessages, action) => {
    switch (action.type) {
        case types.SAVE_MESSAGES:
            return { ...state, isLoggedIn: true, data: action.data }
        default:
            return { ...state }
    }
}


const rootReducer = combineReducers({
    selectedContact: selectContactReducer,
    searchContact: searchContactReducer,
    savedUsers: saveUsersReducer,
    loggedInUser: setLoggedInUserReducer,
    savedMessages: saveMessagesReducer,
})



export default rootReducer;