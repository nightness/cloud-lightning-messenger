import React, { createContext, useState, useReducer, useContext } from 'react'
import { getCollection, callFunction, useAuthState } from '../firebase/Firebase'

export const MessengerContext = createContext()

// Component export
export const MessengerProvider = ({ children }) => {
    const [currentUser, loadingUser, errorUser] = useAuthState()

    return (
        <MessengerContext.Provider value={{ currentUser, loadingUser, errorUser }}>
            {children}
        </MessengerContext.Provider>
    )
}

export const createMessage = (groupId, messageText) =>
    callFunction('addMessage', {
        group: groupId,
        message: messageText,
    })

export const getMessageGroupDetails = groupContainerId =>
    getCollection("/messenger/")
        .doc(groupContainerId)
        .get()


const createMessenger = (groupContainerId, viewLengthMinimum) => {
    const result = {}
    result.groupContainerId = groupContainerId
    result.messageCollectionPath = "/messenger/" + groupContainerId + "/messages/"
    result.groupDocumentPath = "/messenger/" + groupContainerId
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