import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/functions';
import * as FirebaseAuth from 'react-firebase-hooks/auth';
import * as FirebaseFirestore from 'react-firebase-hooks/firestore';
import { useReducer } from 'react-native'
import { firebaseConfig } from '../private/FirebaseConfig'

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const getAuth = () => {
    var auth = firebase.auth()

    return auth
}

export const getFirestore = () => {
    var firestore = firebase.firestore();
    if (false && location.hostname === "localhost") {
        firestore.settings({
            host: "localhost:8080"
        })
    }
    return firestore;
}

getFirestore().enablePersistence()
    .then(() => {
        console.warn('Firestore Persistence Enabled!!!')
    })
    .catch((err) => {
        // Not supported
        if (err.code === 'unimplemented')
            console.error('Firestore Persistence: unimplemented')

        // Open in another tab
        if (err.code === 'failed-precondition')
            console.error('Firestore Persistence: failed-precondition')
    })

export const firebaseAuth = firebase.auth
export const firebaseFunctions = firebase.functions
export const firebaseFirestore = firebase.firestore

export const GoogleAuthProvider = firebase.auth.GoogleAuthProvider

export const getCurrentTimeStamp = () => firebase.firestore.FieldValue.serverTimestamp()
export const getCurrentUser = () => firebaseAuth().currentUser

export const useAuthState = () => FirebaseAuth.useAuthState(firebaseAuth())
export const useAuthRest = () => {
    // useReducer
}

export const getCollection = (collectionPath) => getFirestore().collection(collectionPath)
export const useCollection = (collectionPath, includeMetadataChanges = false) => (!collectionPath ?
    [undefined, false, new Error('useCollection: collectionPath not specified')] :
    FirebaseFirestore.useCollection(
        getCollection(collectionPath),
        {
            snapshotListenOptions: { includeMetadataChanges },
        }
    )
)

export const useCollectionOnce = (collectionPath, includeMetadataChanges = false) => (!collectionPath ?
    [undefined, false, new Error('useCollectionOnce: collectionPath not specified')] :
    FirebaseFirestore.useCollectionOnce(
        getCollection(collectionPath),
        {
            snapshotListenOptions: { includeMetadataChanges },
        }
    )
)

export const useCollectionData = (collectionPath, includeMetadataChanges = false) => (!collectionPath ?
    [undefined, false, new Error('useCollectionData: collectionPath not specified')] :
    FirebaseFirestore.useCollectionData(
        getCollection(collectionPath),
        {
            snapshotListenOptions: { includeMetadataChanges },
        }
    )
)

export const useCollectionDataOnce = (collectionPath, includeMetadataChanges = false) => (!collectionPath ?
    [undefined, false, new Error('useCollectionDataOnce: collectionPath not specified')] :
    FirebaseFirestore.useCollectionDataOnce(
        getCollection(collectionPath),
        {
            snapshotListenOptions: { includeMetadataChanges },
        }
    )
)

export const getDocument = (documentPath) => getFirestore().doc(documentPath)
export const useDocument = (documentPath, includeMetadataChanges = false) => (!documentPath ?
    [undefined, false, new Error('useDocument: documentPath was not specified')] :
    FirebaseFirestore.useDocument(
        getDocument(documentPath),
        {
            snapshotListenOptions: { includeMetadataChanges },
        }
    )
)

export const useDocumentOnce = (documentPath, includeMetadataChanges = false) => (!documentPath ?
    [undefined, false, new Error('useDocumentOnce: documentPath was not specified')] :
    FirebaseFirestore.useDocumentOnce(
        getDocument(documentPath),
        {
            snapshotListenOptions: { includeMetadataChanges },
        }
    )
)

export const useDocumentData = (documentPath, includeMetadataChanges = false) => (!documentPath ?
    [undefined, false, new Error('useDocumentData: documentPath was not specified')] :
    FirebaseFirestore.useDocumentData(
        getDocument(documentPath),
        {
            snapshotListenOptions: { includeMetadataChanges },
        }
    )
)

export const useDocumentDataOnce = (documentPath, includeMetadataChanges = false) => (!documentPath ?
    [undefined, false, new Error('useDocument: documentPath was not specified')] :
    FirebaseFirestore.useDocumentDataOnce(
        getDocument(documentPath),
        {
            snapshotListenOptions: { includeMetadataChanges },
        }
    )
)

export const getData = (snapshot, orderBy, length, firstItem) => {
    if (!orderBy)
        return snapshot.query.get()
    else if (!length)
        return snapshot.query.orderBy(orderBy).get()
    else if (!firstItem)
        return snapshot.query.orderBy(orderBy).limitToLast(length).get()
    else
        return snapshot.query.orderBy(orderBy).limitToLast(length).startAt(firstItem).get()
}

export const getDocumentsDataWithId = querySnapshot => {
    let docs = [];
    querySnapshot.docs.forEach((doc) => {
        const data = doc.data()
        // Adds the doc's id to it's own data
        data.id = doc.id;
        docs.push(data);
    })
    return docs;
}

export const collectionContains = async (collection, docId) => {
    const firestore = firebaseFirestore()
    return await firestore.collection(collection).doc("ABC").get()
}

// Returns a promise
export const callFirebaseFunction = (funcName, data) => {
    return firebaseFunctions().httpsCallable(funcName)(data)
}

const createFunctions = (communityId, chatRoomId) => {
    const result = {}
    result.functions = communityId
    return result
}

// export const useFunctions = () => useReducer(reducer, createFunctions)

// function reducer(state, action) {
//     console.log(state)
//     switch (action.type) {
//         case 'invoke':
//             console.log("invoke action")
//             return state
//         default:
//             return state
//     }
// }