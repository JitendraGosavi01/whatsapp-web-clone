export const types = {
    IS_CONTACT_SELECTED: 'IS_CONTACT_SELECTED',
    SEARCH_CONTACT: 'SEARCH_CONTACT',
    SAVE_USERS: 'SAVE_USERS',
    SET_LOGGED_IN_USER: 'SET_LOGGED_IN_USER',
    SAVE_MESSAGES: 'SAVE_MESSAGES',
}

export const handleSelectedContact = (data) => {
    return (dispatch) => {
        dispatch({ type: types.IS_CONTACT_SELECTED, data: data })

    }
}

export const saveUsersToGlobalState = (data) => {
    return (dispatch) => {
        dispatch({ type: types.SAVE_USERS, data: data })
    }
}

export const searchContact = (data) => {
    return (dispatch) => {
        dispatch({ type: types.SEARCH_CONTACT, data: data })
    }
}

export const setLoggedInUser = (user) => {
    return (dispatch) => {
        dispatch({ type: types.SET_LOGGED_IN_USER, data: user })
    }
}

export const saveMessages = (messages) => {
    return (dispatch) => {
        dispatch({ type: types.SAVE_MESSAGES, data: messages })
    }
}