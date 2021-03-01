import React, { useReducer } from 'react'
import { callFirebaseFunction } from '../firebase/Firebase'

export const createMessage = (messageText: string) =>
    callFirebaseFunction('addMessage', {
        message: messageText,
    })

export const useMessenger = (messengerContainerId: string, viewLengthMinimum: number) =>
    useReducer(reducer, {
        messengerContainerId,
        messageCollectionPath: '/members/' + messengerContainerId + '/messages/',
        messengerDocumentPath: '/members/' + messengerContainerId,
        viewLength: viewLengthMinimum,
    })

function reducer(state, action) {
    switch (action.type) {
        case 'setView': {
            const newState = { ...state }
            newState.viewLength = action.length ? action.length : newState.viewLength
            newState.viewFirst = action.first ? action.first : newState.viewFirst
            newState.viewLast = action.last ? action.last : newState.viewLast
            return newState
        }
        case 'incrementViewLength': {
            const newState = { ...state }
            newState.viewLength =
                newState.viewLength + (action.amount ? action.amount : 1)
            console.log(`incrementViewLength: new length = ${newState.viewLength}`)
            return newState
        }
        default:
            return state
    }
}
