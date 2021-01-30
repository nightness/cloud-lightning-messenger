import React, { createContext, useState, useReducer } from 'react'
import { ActivityIndicator } from 'react-native'
import { getCollection, callFirebaseFunction, useAuthState } from '../firebase/Firebase'

export const MessengerContext = createContext()

// Component export
export const MessengerProvider = ({ children }) => {
    const [currentUser, loadingUser, errorUser] = useAuthState()

    if (loadingUser)
        return <ActivityIndicator />
    else if (errorUser)
        return <DisplayError
            permissionDenied={(errorUser === 'permission-denied')}
        />
    return (
        <MessengerContext.Provider value={{ currentUser, loadingUser, errorUser }}>
            {children}
        </MessengerContext.Provider>
    )
}

export const createMessage = (messageText) =>
    callFirebaseFunction('addMessage', {
        message: messageText,
    })


const createMessenger = (messengerContainerId, viewLengthMinimum) => {
    const result = {}
    result.messengerContainerId = messengerContainerId
    result.messageCollectionPath = "/messenger/" + messengerContainerId + "/messages/"
    result.messengerDocumentPath = "/messenger/" + messengerContainerId
    result.viewLength = viewLengthMinimum
    return result
}

export const useMessenger = (groupContainerId, viewLengthMinimum) =>
    useReducer(reducer, createMessenger(groupContainerId, viewLengthMinimum))

function reducer(state, action) {
    switch (action.type) {
        case "setView": {
            const newState = { ...state }
            newState.viewLength = action.length ? action.length : newState.viewLength
            newState.viewFirst = action.first ? action.first : newState.viewFirst
            newState.viewLast = action.last ? action.last : newState.viewLast
            return newState
        }
        case 'incrementViewLength': {
            const newState = { ...state }
            newState.viewLength = newState.viewLength + (action.amount ? action.amount : 1)
            console.log(`incrementViewLength: new length = ${newState.viewLength}`)
            return newState
        }
        default:
            return state
    }
}