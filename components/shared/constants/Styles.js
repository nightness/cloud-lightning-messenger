import { StyleSheet } from 'react-native'

export const screen = StyleSheet.create({
    icons: {
        paddingHorizontal: 3
    },
})

export const modal = StyleSheet.create({
    content: {

    }
})

export const auth = StyleSheet.create({
    logo: {
        flex: 1,
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30
    },
    footerView: {
        flex: 1,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
})

export const views = StyleSheet.create({
    screen: {
        flex: 1,
        paddingBottom: 2
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    scrollView: {
        flex: 1,
    }
})

export const button = StyleSheet.create({
    native: {

    },
    touchable: {
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    text: {
        fontWeight: '600'
    }
})

export const container = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        borderRadius: 5
    },
    scrollView: {
        width: "100%",
    }
})

export const infiniteScroll = StyleSheet.create({
    view: {
        flex: 1,
        margin: 5,
        padding: 5,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#48a",
        width: "100%"
    }
})

export const textInput = StyleSheet.create({
    input: {
        height: 32,
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 5,
        marginHorizontal: 5,
        paddingLeft: 10
    },
})

export const picker = StyleSheet.create({
    container: {

    },
    togglebox: {
        backgroundColor: '#ddd',
        borderColor: 'rgb(178,181,189)',
        borderBottomWidth: 1,
    },
    picker: {
        margin: 5,
        backgroundColor: '#999',
        paddingHorizontal: 2
    },
})


export const logoutModal = StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10
    },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    button: {
        marginTop: 5,
        marginHorizontal: 10
    }
})

export const messenger = StyleSheet.create({
    viewChat: {
        flex: 1,
        margin: 5,
        padding: 5,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#48a",
        width: "100%"
    },
    commentInput: {
        flexDirection: 'row',
    },
    viewTextInput: {
        width: "100%",
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#48a",
    },
    flatlist: {

    },
    textInput: {
        width: "100%",
        height: 35,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    sendButton: {
        marginHorizontal: 10,
        marginVertical: 5,
        height: 35,
    }
})