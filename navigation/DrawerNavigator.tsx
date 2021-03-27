import 'react-native-gesture-handler'
import React, { useContext, useReducer } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerProvider } from '../navigation/DrawerContext'
import { ProfileProvider } from '../app/ProfileContext'
import { DrawerContent } from './DrawerContent'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { RoutingReducer } from './RouteReducer'
import { rootScreens } from './DefaultRoutes'

const Drawer = createDrawerNavigator()

export default () => {
    const [screens, screensDispatch] = useReducer(RoutingReducer, rootScreens)
    const { claims } = useContext(FirebaseContext)

    return (
        <ProfileProvider>
            <DrawerProvider screens={screens} screensDispatch={screensDispatch}>
                <Drawer.Navigator
                    drawerContent={props => <DrawerContent {...props} />}
                    sceneContainerStyle={{ padding: 0, paddingLeft: 0, paddingRight: 0 }}
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
