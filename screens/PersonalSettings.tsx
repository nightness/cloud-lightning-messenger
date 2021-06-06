import React, { useContext } from 'react'
import { ReturnKeyTypeOptions, View, StyleSheet } from 'react-native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { Screen, FormField, Text } from '../components'
import { Formik, FormikProps } from 'formik'
import { FirebaseContext } from '../database/FirebaseContext'

interface SettingProp {
    label: string,
    fieldName: string,
    formikProps: FormikProps<any>
    returnKeyType?: ReturnKeyTypeOptions
}

const Setting = ({ label, fieldName, formikProps, returnKeyType = 'none' }: SettingProp) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
            <Text fontWeight='500' style={{ flex: 1 }}>{label}</Text>
            <FormField
                style={[styles.formField, { flex: 3 }]}
                testInputStyle={styles.textInput}
                label={label}
                formikProps={formikProps}
                fieldName={fieldName}
                returnKeyType={returnKeyType}
            />
        </View>
    )

}

interface Props {
    navigation: DrawerNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const { currentUser } = useContext(FirebaseContext)

    return (
        <Screen navigation={navigation} title='Personal Settings'>
            <View style={{ flex: 1 }}>
                <Formik
                    initialValues={{
                        displayName: currentUser?.displayName,
                        eMail: currentUser?.email,
                    }}
                    // validationSchema={scheme}
                    onSubmit={(values, helpers) => {

                    }}
                >
                    {(formikProps) => (<>
                        <Setting
                            formikProps={formikProps}
                            label='Display Name'
                            fieldName='displayName'
                        />
                        <Setting
                            formikProps={formikProps}
                            label='E-Mail'
                            fieldName='eMail'
                        />
                    </>)}
                </Formik>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    formField: {
        marginVertical: 5,
        marginHorizontal: 15,
    },
    textInput: {
        padding: 5
    },
    button: {

    }
})