import 'react-native-gesture-handler'
import React, { useContext, useReducer } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerProvider } from '../navigation/DrawerContext'
import { ProfileProvider } from '../app/ProfileContext'
import { DrawerContent } from './DrawerContent'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { RoutingReducer } from './RouteReducer'
import { Screens } from './NavigationTypes'
import { StyleProp, ViewStyle } from 'react-native'

const Drawer = createDrawerNavigator()

interface Props {
    initialScreens: Screens,
    drawerStyle?: StyleProp<ViewStyle>
}

export default ({ initialScreens, ...restProps }: Props) => {
    const [screens, screensDispatch] = useReducer(RoutingReducer, initialScreens)
    const { claims } = useContext(FirebaseContext)

    return (
        <ProfileProvider>
            <DrawerProvider screens={screens} screensDispatch={screensDispatch}>
                <Drawer.Navigator
                    {...restProps}
                    drawerContent={props => <DrawerContent {...props} />}
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
