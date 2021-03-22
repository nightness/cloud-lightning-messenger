import * as firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/functions'
import * as FirebaseAuth from 'react-firebase-hooks/auth'
import * as FirebaseFirestore from 'react-firebase-hooks/firestore'
import { firebaseConfig } from './FirebaseConfig'
import * as Defaults from '../app/Defaults'
import * as Google from 'expo-google-app-auth'
import { androidClientId, iosClientId } from '../private/FirebaseAuth'

export type AuthError = firebase.auth.Error
export type DocumentData = firebase.firestore.DocumentData
export type DocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>
export type Timestamp = firebase.firestore.Timestamp
export type QuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>
export type QueryDocumentSnapshot<T> = firebase.firestore.QueryDocumentSnapshot<T>

interface LoginSuccess {
    type: 'success'
    accessToken?: string
    idToken?: string
    refreshToken?: string
    user: Google.GoogleUser
}

export const getFirestore = () => {
    var firestore = firebase.firestore()
    if (false && location.hostname === 'localhost') {
        firestore.settings({
            host: 'localhost:8080',
        })
    }
    return firestore
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

if (Defaults.enableFirebasePersistence) {
    getFirestore()
        .enablePersistence()
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
}

export const getAuth = () => firebase.auth()
export const firebaseAuth = firebase.auth
export const firebaseFunctions = firebase.functions
export const firebaseFirestore = firebase.firestore

export const GoogleAuthProvider = firebase.auth.GoogleAuthProvider

export const getCurrentTimeStamp = () => firebase.firestore.FieldValue.serverTimestamp()
export const getCurrentUser = () => firebaseAuth().currentUser

export const useAuthState = () => FirebaseAuth.useAuthState(firebaseAuth())

export const getCollection = (collectionPath: string) =>
    getFirestore().collection(collectionPath)
export const useCollection = (collectionPath: string, includeMetadataChanges = false) =>
    !collectionPath
        ? [undefined, false, new Error('useCollection: collectionPath not specified')]
        : FirebaseFirestore.useCollection(getCollection(collectionPath), {
              snapshotListenOptions: { includeMetadataChanges },
          })

export const useCollectionOnce = (
    collectionPath: string,
    includeMetadataChanges = false
) =>
    !collectionPath
        ? [undefined, false, new Error('useCollectionOnce: collectionPath not specified')]
        : FirebaseFirestore.useCollectionOnce(getCollection(collectionPath))

export const useCollectionData = (
    collectionPath: string,
    includeMetadataChanges = false
) =>
    !collectionPath
        ? [undefined, false, new Error('useCollectionData: collectionPath not specified')]
        : FirebaseFirestore.useCollectionData(getCollection(collectionPath))

export const useCollectionDataOnce = (
    collectionPath: string,
    includeMetadataChanges = false
) =>
    !collectionPath
        ? [
              undefined,
              false,
              new Error('useCollectionDataOnce: collectionPath not specified'),
          ]
        : FirebaseFirestore.useCollectionDataOnce(getCollection(collectionPath))

export const getDocument = (documentPath: string) => getFirestore().doc(documentPath)
export const useDocument = (documentPath: string, includeMetadataChanges = false) =>
    !documentPath
        ? [undefined, false, new Error('useDocument: documentPath was not specified')]
        : FirebaseFirestore.useDocument(getDocument(documentPath), {
              snapshotListenOptions: { includeMetadataChanges },
          })

export const useDocumentOnce = (documentPath: string, includeMetadataChanges = false) =>
    !documentPath
        ? [undefined, false, new Error('useDocumentOnce: documentPath was not specified')]
        : FirebaseFirestore.useDocumentOnce(getDocument(documentPath))

export const useDocumentData = (documentPath: string, includeMetadataChanges = false) =>
    !documentPath
        ? [undefined, false, new Error('useDocumentData: documentPath was not specified')]
        : FirebaseFirestore.useDocumentData(getDocument(documentPath), {
              snapshotListenOptions: { includeMetadataChanges },
          })

export const useDocumentDataOnce = (
    documentPath: string,
    includeMetadataChanges = false
) =>
    !documentPath
        ? [undefined, false, new Error('useDocument: documentPath was not specified')]
        : FirebaseFirestore.useDocumentDataOnce(getDocument(documentPath))

export const getData = (
    querySnapshot: QuerySnapshot<DocumentData>,
    orderBy?: string,
    length?: number,
    firstItem?: any
) => {
    if (!orderBy) return querySnapshot.query.get()
    else if (!length) return querySnapshot.query.orderBy(orderBy).get()
    else if (!firstItem)
        return querySnapshot.query.orderBy(orderBy).limitToLast(length).get()
    else
        return querySnapshot.query
            .orderBy(orderBy)
            .limitToLast(length)
            .startAt(firstItem)
            .get()
}

export const getDocumentsDataWithId = (querySnapshot: QuerySnapshot<DocumentData>) => {
    let docs: DocumentData[] = []
    querySnapshot.docs.forEach((doc) => {
        const data = doc.data()
        // Adds the doc's id to it's own data
        data.id = doc.id
        docs.push(data)
    })
    return docs
}

export const collectionContains = async (collection: string, docId: string) => {
    const firestore = firebaseFirestore()
    return await firestore.collection(collection).doc('ABC').get()
}

// Returns a promise
export const callFirebaseFunction = (funcName: string, data: any) => {
    return firebaseFunctions().httpsCallable(funcName)(data)
}

export async function signInWithGoogleAsync() {
    //logOutAsync({ accessToken, iosClientId, androidClientId, iosStandaloneAppClientId, androidStandaloneAppClientId }): Promise<any>

    try {
        const result = await Google.logInAsync({
            behavior: 'web',
            androidClientId,
            iosClientId,
            scopes: ['profile', 'email'],
        })
        if (result.type === 'success') {
            const { idToken } = result as LoginSuccess
            let credential = GoogleAuthProvider.credential(idToken)
            return firebase.auth().signInWithCredential(credential)
        }
    } catch (error) {
        console.error(error)
    }
}
