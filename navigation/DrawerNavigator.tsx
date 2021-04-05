import 'react-native-gesture-handler'
import React, { useContext, useReducer } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerProvider } from '../navigation/DrawerContext'
import { DrawerContent } from './DrawerContent'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { ScreensReducer } from './RoutingReducer'
import { NavigationElements } from './NavigationTypes'
import { StyleProp, ViewStyle } from 'react-native'
import { Claims } from '../firebase/DataTypes'

const Drawer = createDrawerNavigator()

interface Props {
    initialScreens: NavigationElements,
    drawerStyle?: StyleProp<ViewStyle>
}

export default ({ initialScreens, ...restProps }: Props) => {
    // The stateful list of screens
    const [screens, screensDispatch] = useReducer(ScreensReducer, initialScreens)
    const { claims } = useContext(FirebaseContext)

    let parentStack: [string] = ['[root]']
    let currentDepth = -1

    return (
        <DrawerProvider screens={screens} screensDispatch={screensDispatch}>
            <Drawer.Navigator
                {...restProps}
                drawerContent={props => <DrawerContent {...props} />}>
                {screens.map((screen) => {
                    const depthDelta = screen.depth - currentDepth
                    // Depth increased since last screen
                    if (screen.depth > currentDepth) {
                        // Can't have grandchildren without children
                        if (depthDelta !== 1)
                            throw new Error('depth step up change does not equal 1');                          
                        currentDepth++
                        parentStack.push(screen.routeName)
                    }
                    // Depth decreased since last screen
                    if (screen.depth < currentDepth) {
                        for (let i = depthDelta; i < 0; i++) {
                            currentDepth--
                            parentStack.pop()
                        }
                    }
                    if (screen.claims) {
                        let hasClaim = false
                        screen.claims.forEach((claim) => {                            
                            // @ts-expect-error
                            if (claims[claim]) {
                                hasClaim = true
                            }
                        })
                        if (!hasClaim) return
                    }                    
                    return (
                        <Drawer.Screen
                            name={screen.routeName}
                            component={screen.component}
                            initialParams={screen.initialParams}
                            key={`${parentStack.join(String.fromCharCode(255))}`} />
                    )
                })}
            </Drawer.Navigator>
        </DrawerProvider>
    )
}
