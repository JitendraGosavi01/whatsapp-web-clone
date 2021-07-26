import React, { useEffect } from 'react'
import { Button } from '@material-ui/core'
import './Login.css'
import firebase from 'firebase'
import db, { provider } from '../../config/firebase'
import * as actions from '../../Redux/Action'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
function Login() {
    const dispatch = useDispatch()
    const { setLoggedInUser, saveUsersToGlobalState, saveMessages } = bindActionCreators(actions, dispatch)
    const savedUsers = useSelector(state => state.savedUsers)


    console.log("savedUsers", savedUsers)
    useEffect(() => {
        const unsubscribe = db.collection('users')
            .onSnapshot((snapshot) =>
                saveUsersToGlobalState(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data()
                })))
            )
        return () => {
            unsubscribe()
        }
    }, [])


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

    const checkIfUserExists = (email, newUser) => {
        console.log(typeof savedUsers.data, savedUsers.data.length)
        let matchedUser = savedUsers.data.find(user => user.data.email === email)
        console.log(matchedUser);
        if (matchedUser) {
            return [true, matchedUser.data]
        } else {
            return [false, newUser]
        }
    }
    const signIn = () => {
        firebase.auth().signInWithPopup(provider).then(result => {
            // console.log(result);

            let [isUserExists, existingUser] = checkIfUserExists(result.user?.email, result.user)
            if (isUserExists) {
                setLoggedInUser(existingUser)

            } else {
                setLoggedInUser(result.user)
                db.collection('users').doc().set({
                    uid: result.user?.uid,
                    contactName: result.user?.displayName,
                    photoURL: result.user?.photoURL,
                    phoneNumber: result.user?.phoneNumber,
                    email: result.user?.email,
                    timestamp: new Date()
                }).then(() => {

                    alert('doc saved successfully.')
                }).catch(error => {
                    console.log(error)
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }
    return (
        <div className="login">
            <div className="login__container">
                <img src="https://i.pinimg.com/originals/99/0b/7d/990b7d2c2904f8cd9bc884d3eed6d003.png" alt="" />
                <h2>Sign in to WhatsApp</h2>
                <Button onClick={signIn}>Sign in with google</Button>
            </div>
        </div>
    )
}

export default Login



