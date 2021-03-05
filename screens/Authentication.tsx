import React, { useState, useContext, useEffect } from 'react'
import { Image, NativeSyntheticEvent, Platform, TextInputKeyPressEventData } from 'react-native'
import {
    Container,
    Text,
    TextInput,
    Button,
    ScrollView,
    View,
    Modal,
    ActivityIndicator,
    DisplayError,
} from '../components/Components'
import {
    firebaseAuth,
    GoogleAuthProvider,
    callFirebaseFunction,
} from '../firebase/Firebase'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { Styles } from '../shared/Styles'
import { GlobalContext } from '../shared/GlobalContext'
import { StackNavigationProp } from '@react-navigation/stack'

interface AuthenticationProps {
    navigation: StackNavigationProp<any>
    customToken?: string
}

interface AuthenticationFields {
    displayName: string
    eMail: string
    password: string
    confirmPassword: string
}

const PasswordResetScheme = Yup.object({
    eMail: Yup.string().required().email(),
})

const LoginScheme = Yup.object({
    eMail: Yup.string().required().email(),
    password: Yup.string().required().min(6)
})

const RegistrationScheme = Yup.object({
    displayName: Yup.string().required().min(3),
    eMail: Yup.string().required().email(),
    password: Yup.string().required().min(6),
    confirmPassword: Yup.string().required().min(6)
})

export const Authentication = ({ navigation, customToken }: AuthenticationProps) => {
    const { setDisplayName: firestoreSetDisplayName } = useContext(FirebaseContext)
    const [mode, setMode] = useState<'login' | 'register' | 'password-reset'>('login')
    const [submitted, setSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { theme, setTheme } = useContext(GlobalContext)
    const auth = firebaseAuth()

    const onSignUpPress = () => {
        setMode('register')
    }

    const onGotoLoginPress = () => {
        setMode('login')
    }

    const onRegisterPress = (values: AuthenticationFields) => {
        if (values.password !== values.confirmPassword) {
            alert("Passwords don't match.")
        } else {
            const onRegistrationSetDisplayName = async () => {
                await firestoreSetDisplayName(values.displayName)
                navigation.replace('Main')
            }

            auth.createUserWithEmailAndPassword(values.eMail, values.password)
                .then(() => {
                    setIsLoading(true)
                    onRegistrationSetDisplayName()
                })
                .catch((error) => {
                    alert(error)
                })
        }
    }

    const onPasswordKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        //if (e.nativeEvent.key != 'Enter') return
        //onLoginPress()
    }

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider()
        auth.signInWithRedirect(provider)
            .then(() => {
                navigation.replace('Main')
            })
            .catch((error) => {
                alert(error)
            })
    }

    const onLoginPress = (values: AuthenticationFields) => {
        auth.signInWithEmailAndPassword(values.eMail, values.password)
            .then(() => {
                navigation.replace('Main')
            })
            .catch((error) => {
                alert(error)
            })
    }

    const sendPasswordReset = (values: AuthenticationFields) => {
        setSubmitted(true)
        auth.sendPasswordResetEmail(values.eMail)
            .then(() => {
                setSubmitted(false)
            })
            .catch((error) => {
                alert(error)
                setSubmitted(false)
            })
    }

    useEffect(() => {
        if (theme === 'Dark' && setTheme) setTheme('Light')
    })

    useEffect(() => {
        if (customToken) {
            auth.signInWithCustomToken(customToken)
                .then(() => {
                    navigation.replace('Main')
                })
                .catch((error) => {
                    alert('Invalid custom token specified')
                    setIsLoading(false)
                })
        } else {
            setIsLoading(false)
        }
    }, [])

    if (isLoading) {
        return <ActivityIndicator />
    } else if (error) {
        return <DisplayError error={error} />
    } else {
        return (
            <>
                <Container>
                    <ScrollView
                        bounces={false}
                        style={{ flex: 1, width: '100%' }}
                        keyboardShouldPersistTaps="always"
                    >
                        <Image
                            style={Styles.auth.logo}
                            source={require('../assets/icon.png')}
                        />
                        <Formik
                            initialValues={{
                                displayName: '',
                                eMail: '',
                                password: '',
                                confirmPassword: ''
                            }}
                            onSubmit={(values) => {
                                switch (mode) {
                                    case 'login':
                                        onLoginPress(values)
                                        break
                                    case 'register':
                                        onRegisterPress(values)
                                        break;
                                    case 'password-reset':
                                        sendPasswordReset(values)
                                        break;
                                }
                            }}
                        >
                            {(formikProps) => (
                                <>
                                    {mode === 'register' ? (
                                        <TextInput
                                            placeholder="Full Name"
                                            onChangeText={formikProps.handleChange('displayName')}
                                            value={formikProps.values.displayName}
                                        />
                                    ) : <></>}
                                    <TextInput
                                        placeholder="E-mail"
                                        onChangeText={formikProps.handleChange('eMail')}
                                        value={formikProps.values.eMail}
                                    />
                                    {mode !== 'password-reset' ?
                                        < TextInput
                                            secureTextEntry={true}
                                            placeholder="Password"
                                            onChangeText={formikProps.handleChange('password')}
                                            value={formikProps.values.password}
                                        //onKeyPress={onPasswordKeyPress}
                                        /> : <></>}
                                    {mode === 'register' ? (
                                        <TextInput
                                            secureTextEntry={true}
                                            placeholder="Confirm Password"
                                            onChangeText={formikProps.handleChange('confirmPassword')}
                                            value={formikProps.values.confirmPassword}
                                        />
                                    ) : <></>}
                                    {mode === 'register' ? (
                                        <>
                                            <Button
                                                title="Create Account"
                                                disabled={submitted}
                                                //onPress={onRegisterPress}
                                                onPress={formikProps.handleSubmit}
                                            />
                                            <View style={Styles.auth.footerView}>
                                                <Text fontSize={16}>Already got an account?</Text>
                                                <Button title="Log in" onPress={onGotoLoginPress} />
                                            </View>
                                        </>
                                    ) : <></>}
                                    {mode === 'password-reset' ? (
                                        <>
                                            <View style={Styles.auth.footerView}>
                                                <Button
                                                    disabled={submitted}
                                                    title="Reset Password"
                                                    onPress={formikProps.handleSubmit}
                                                    style={{ marginTop: 5 }}
                                                />
                                                <Button
                                                    disabled={submitted}
                                                    title="Cancel"
                                                    onPress={() => setMode('login')}
                                                    style={{ marginTop: 5 }}
                                                />
                                            </View>
                                        </>
                                    ) : <></>}
                                    {mode === 'login' ? (
                                        <>
                                            <View style={Styles.auth.footerView}>
                                                <Button
                                                    title="Log in"
                                                    disabled={submitted}
                                                    //onPress={onLoginPress}
                                                    onPress={formikProps.handleSubmit}
                                                />
                                            </View>
                                            <View style={Styles.views.flexRowJustifyCenter}>
                                                <View style={Styles.auth.footerView}>
                                                    <Text fontSize={16}>Don't have an account?</Text>
                                                    <Button title="Sign up" onPress={onSignUpPress} />
                                                </View>
                                                <View style={Styles.auth.footerView}>
                                                    <Text fontSize={16}>
                                                        Did you forget your password?
                                                </Text>
                                                    <Button
                                                        title="Password Reset"
                                                        onPress={() => setMode('password-reset')}
                                                    />
                                                </View>
                                                {Platform.OS === 'web' ? (
                                                    <>
                                                        <View style={Styles.auth.footerView}>
                                                            <Text fontSize={16}>Google Sign-In?</Text>
                                                            <Button
                                                                title="Google Sign-In"
                                                                onPress={signInWithGoogle}
                                                            />
                                                        </View>
                                                    </>
                                                ) : <></>}
                                            </View>
                                        </>
                                    ) : <></>}
                                </>
                            )}
                        </Formik>
                    </ScrollView>
                </Container>
            </>
        )
    }
}

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => (
    <Authentication
        navigation={navigation}
    //  customToken={'abc.123.45657'} {/* This is not a valid custom token */}
    />
)
