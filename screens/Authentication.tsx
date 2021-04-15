import * as Google from 'expo-google-app-auth'
import React, { useState, useContext, useEffect } from 'react'
import { Image, ScrollView, Platform, StyleProp, ViewStyle } from 'react-native'
import {
    Container,
    Text,
    TextInput,
    Button,
    View,
    Modal,
    Screen,
    ActivityIndicator,
    DisplayError,
    FormField,
} from '../components/Components'
import {
    firebaseAuth,
    GoogleAuthProvider,
    signInWithGoogleAsync,
} from '../firebase/Firebase'
import { Formik, FormikHelpers, FormikProps, useFormik } from 'formik'
import * as Yup from 'yup'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { Styles } from '../app/Styles'
import { GlobalContext } from '../app/GlobalContext'
import { StackNavigationProp } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'
import { Icon } from 'react-native-elements'
import { GradientColors } from '../app/GradientColors'

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

function equalTo(ref: any, msg: any) {
    return Yup.mixed().test({
        name: 'equalTo',
        exclusive: false,
        message: msg || '${path} must be the same as ${reference}',
        params: {
            reference: ref.path,
        },
        test: function (value: any) {
            return value === this.resolve(ref);
        },
    });
}
// @ts-ignore
Yup.addMethod(Yup.string, 'equalTo', equalTo);

const PasswordResetScheme = Yup.object({
    eMail: Yup.string()
        .required('E-mail is a required field')
        .email('Please enter a valid e-mail address')
})

const LoginScheme = Yup.object({
    eMail: Yup.string()
        .required('E-mail is a required field')
        .email('Please enter a valid e-mail address'),
    password: Yup.string()
        .required('Password is a required field')
        .min(8),
})

const RegistrationScheme = Yup.object({
    displayName: Yup.string().required().min(3),
    eMail: Yup.string()
        .required('E-mail is a required field')
        .email('Please enter a valid e-mail address')
        .matches(/^((?!@gmail.com).)*$/igm, 'Use the Google Sign-In button to automatically sign-in with your Google'),
    password: Yup.string()
        .required('Password is a required field')
        .min(8),
    confirmPassword: Yup.string()
        // @ts-ignore
        .equalTo(Yup.ref('password'), 'Both passwords must match')
        .required('Please retype your password')
})

export const Authentication = ({ navigation, customToken }: AuthenticationProps) => {
    const { setProfileAttribute: firestoreSetDisplayName } = useContext(FirebaseContext)
    const [mode, setMode] = useState<'login' | 'register' | 'password-reset'>('login')
    const [scheme, setScheme] = useState<object>()
    const [submitted, setSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { theme, setTheme, isKeyboardOpen, keyboardHeight, screenOrientation, window } = useContext(GlobalContext)
    const { width, height } = window
    const [screenStyle, setScreenStyle] = useState<StyleProp<ViewStyle>>({
        height, width, position: 'absolute'
    })
    const auth = firebaseAuth()

    const softReset = (formikProps: FormikProps<any>) => {
        formikProps.setValues({
            displayName: '',
            eMail: formikProps.values.eMail,
            password: '',
            confirmPassword: ''
        })
        formikProps.setTouched({
            displayName: false,
            eMail: false,
            password: false,
            confirmPassword: false
        })
        formikProps.setErrors({
            displayName: undefined,
            eMail: undefined,
            password: undefined,
            confirmPassword: undefined
        })
    }

    const onSignUpPress = (formikProps: FormikProps<any>) => {
        setMode('register')
        softReset(formikProps)
    }

    const onGotoLoginPress = (formikProps: FormikProps<any>) => {
        setMode('login')
        softReset(formikProps)
    }

    const onRegisterPress = (values: AuthenticationFields, helpers: FormikHelpers<any>) => {
        const setProfileAttribute = async () => {
            console.log(values)
            await firestoreSetDisplayName(values.displayName)
            navigation.replace('Main')
        }

        auth.createUserWithEmailAndPassword(values.eMail, values.password)
            .then(() => {
                setIsLoading(true)
                setProfileAttribute()
            })
            .catch((error) => {
                setSubmitted(false)
                alert(error)
            })
    }

    const signInWithGoogle = async (formikProps: FormikProps<any>) => {
        if (Platform.OS === 'web') {
            const provider = new GoogleAuthProvider()
            auth.signInWithRedirect(provider)
                .then(() => {
                    navigation.replace('Main')
                })
                .catch((error) => {
                    setSubmitted(false)
                    alert(error)
                })
        } else if (Platform.OS === 'android' || Platform.OS === 'ios') {
            signInWithGoogleAsync().then(() => {
                navigation.replace('Main')
            })
            .catch((error) => {
                alert(error)
                setIsLoading(false)
            })

        }
        formikProps.resetForm()
    }

    const onLoginPress = async (values: AuthenticationFields, helpers: FormikHelpers<any>) => {
        setSubmitted(true)
        try {
            await auth.signInWithEmailAndPassword(values.eMail, values.password)
            navigation.replace('Main')
        }
        catch (error) {
            setSubmitted(false)
            alert(error)
        }
    }

    const sendPasswordReset = (values: AuthenticationFields, helpers: FormikHelpers<any>) => {
        setSubmitted(true)
        auth.sendPasswordResetEmail(values.eMail)
            .then(() => {
                setMode('login')
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

    useEffect(() => {
        switch (mode) {
            case 'login':
                setScheme(LoginScheme)
                break
            case 'register':
                setScheme(RegistrationScheme)
                break
            case 'password-reset':
                setScheme(PasswordResetScheme)
        }

    }, [mode])

    useEffect(() => {
        if (isKeyboardOpen && height) {
            setScreenStyle({
                height: height - keyboardHeight, width, position: 'absolute'
            })
        } else {
            setScreenStyle({
                height, width, position: 'absolute'
            })
        }
    }, [isKeyboardOpen, keyboardHeight, screenOrientation, width, height])

    if (isLoading) {
        return <ActivityIndicator />
    } else if (error) {
        return <DisplayError error={error} />
    } else {
        return (
            <Screen navigation={navigation} title=''>
                <LinearGradient
                    colors={GradientColors[theme].authentication}
                    style={screenStyle}
                >
                    <View style={{ flex: 1 }}>
                        <ScrollView style={{ flex: 1 }}>
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
                                validationSchema={scheme}
                                onSubmit={(values, helpers) => {
                                    switch (mode) {
                                        case 'login':
                                            onLoginPress(values, helpers)
                                            break
                                        case 'register':
                                            onRegisterPress(values, helpers)
                                            break;
                                        case 'password-reset':
                                            sendPasswordReset(values, helpers)
                                    }
                                }}
                            >
                                {(formikProps) => (
                                    <>
                                        {mode === 'register' ? (
                                            <FormField
                                                label='Full Name'
                                                formikProps={formikProps}
                                                fieldName='displayName'
                                                returnKeyType='none'
                                            />
                                        ) : <></>}
                                        <FormField
                                            formikProps={formikProps}
                                            fieldName='eMail'
                                            label="E-Mail"
                                            returnKeyType={mode === 'password-reset' ? 'done' : 'none'}
                                        />
                                        {mode !== 'password-reset' ?
                                            <FormField
                                                formikProps={formikProps}
                                                secureTextEntry={true}
                                                label='Password'
                                                fieldName='password'
                                                returnKeyType={mode !== 'register' ? 'done' : 'none'}
                                            /> : <></>}

                                        {mode === 'register' ? (
                                            <>
                                                <FormField
                                                    formikProps={formikProps}
                                                    secureTextEntry={true}
                                                    label="Confirm Password"
                                                    fieldName='confirmPassword'
                                                    returnKeyType='done'
                                                />
                                                <Button
                                                    title="Create Account"
                                                    disabled={submitted}
                                                    onPress={formikProps.handleSubmit}
                                                />
                                                <View style={Styles.auth.footerView}>
                                                    <Text fontSize={16}>Already got an account?</Text>
                                                    <Button title="Log in" onPress={() => onGotoLoginPress(formikProps)} />
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
                                                        onPress={() => onGotoLoginPress(formikProps)}
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
                                                    <Button
                                                        //title="Google Sign-In"                                                    
                                                        onPress={() => signInWithGoogle(formikProps)}
                                                        style={{ margin: 5 }}
                                                    >
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Icon color={'white'} size={24} name='logo-google' type='ionicon' />
                                                            <Text>oogle Sign-In</Text>
                                                        </View>
                                                    </Button>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={Styles.auth.footerView}>
                                                        <Text fontSize={16}>Don't have an account?</Text>
                                                        <Button title="Sign up" onPress={() => onSignUpPress(formikProps)} />
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
                                                </View>
                                            </>
                                        ) : <></>}
                                    </>
                                )}
                            </Formik>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                <Text>{`Cloud Lightning Messenger - Beta`}</Text>
                            </View>
                        </ScrollView>
                    </View>
                </LinearGradient>
            </Screen>
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
