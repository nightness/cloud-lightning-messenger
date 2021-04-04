import 'react-native-gesture-handler'
import React, { useContext, useReducer } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerProvider } from '../navigation/DrawerContext'
import { ProfileProvider } from '../app/ProfileContext'
import { DrawerContent } from './DrawerContent'
import { FirebaseContext } from '../firebase/FirebaseContext'
import { ScreensReducer } from './RoutingReducer'
import { NavigationElements } from './NavigationTypes'
import { StyleProp, ViewStyle } from 'react-native'

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
                    if (screen.depth > currentDepth) {
                        if (screen.depth !== (currentDepth + 1))
                            throw new Error('depth step change does not equal 1');
                        currentDepth++
                        parentStack.push(screen.routeName)
                    }
                    if (screen.depth < currentDepth) {
                        if (screen.depth !== (currentDepth - 1))
                            throw new Error('depth step change does not equal 1');
                        currentDepth--
                        parentStack.pop()
                    }
                    if (screen.claims) {
                        if (screen.claims.indexOf('admin') !== -1 && !claims?.admin) return
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

// export default ({ initialScreens, ...restProps }: Props) => {
//     const [screens, screensDispatch] = useReducer(RoutingReducer, initialScreens)
//     const { claims } = useContext(FirebaseContext)

//     return (
//         <ProfileProvider>
//             <DrawerProvider screens={screens} screensDispatch={screensDispatch}>
//                 <Drawer.Navigator
//                     {...restProps}
//                     drawerContent={props => <DrawerContent {...props} />}
//                 >
//                     {
//                         screens.map((screen) => {
//                             if (screen.claims) {
//                                 if (screen.claims.indexOf('admin') !== -1 && !claims?.admin) return
//                             }
//                             return (
//                                 <Drawer.Screen
//                                     name={screen.name}
//                                     component={screen.component}
//                                     initialParams={screen.initialParams}
//                                     key={`root-${screen.name}`} />
//                             )
//                         })
//                     }
//                 </Drawer.Navigator>
//             </DrawerProvider>
//         </ProfileProvider>
//     )
// }
