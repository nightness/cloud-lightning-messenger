import { ComponentType } from 'react'
import { NavigationParams } from './DrawerParams'

export type Notifications = {
    groups: { [routeName: string] : {} }
}

export type Badges = { [routeName: string] : {} }

export type ScreenConfig = {
    name: string
    component: ComponentType<any>,
    initialParams: NavigationParams,
    claims?: string[]
}

export type Screens = ScreenConfig[]
