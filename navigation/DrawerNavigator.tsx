import 'react-native-gesture-handler'
import React, { useContext } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerProvider } from '../navigation/DrawerContext'
import { ProfileProvider } from '../app/ProfileContext'
import { DrawerContent } from './DrawerContent'
import { DrawerContext } from './DrawerContext'
import { FirebaseContext } from '../firebase/FirebaseContext'

const Drawer = createDrawerNavigator()

export default () => {
    const { claims } = useContext(FirebaseContext)
    const { screens } = useContext(DrawerContext)

    return (
        <ProfileProvider>
            <DrawerProvider>
                <Drawer.Navigator
                    drawerContent={props => <DrawerContent {...props} />}
                    drawerStyle={{
                        //width: '200' --- Find and remove padding to the right of the badges
                    }}
                >
                    {
                        screens.map((screen) => {
                            if (screen.claims) {
                                if (screen.claims.indexOf('admin') !== -1 && !claims?.admin) return
                            }
                            return (
                                <Drawer.Screen
                                    name={screen.name}
                                    component={screen.component}
                                    initialParams={screen.initialParams}
                                    key={`root-${screen.name}`} />
                            )
                        })
                    }
                </Drawer.Navigator>
            </DrawerProvider>
        </ProfileProvider>
    )
}
