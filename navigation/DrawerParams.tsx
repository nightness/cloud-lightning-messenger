const randomColor = () => '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')

export interface NavigationParams {
    activeTintColor?: string
    inactiveTintColor?: string
    iconGroup?: string
    iconName: string
    focusedIconName?: string
}

export const homeParams: NavigationParams = {
    activeTintColor: randomColor(),
    inactiveTintColor: randomColor(),
    iconGroup: 'ionicon',
    iconName: 'home',
    focusedIconName: 'home-outline'
}

export const messagesParams: NavigationParams = {
    activeTintColor: randomColor(),
    inactiveTintColor: randomColor(),
    iconGroup: 'ionicon',
    iconName: 'chatbox',
    focusedIconName: 'chatbox-outline'
}

export const myWallParams: NavigationParams = {
    activeTintColor: randomColor(),
    inactiveTintColor: randomColor(),
    iconGroup: 'ionicon',
    iconName: 'book',
    focusedIconName: 'book-outline'
}

export const memberWallParams: NavigationParams = {
    activeTintColor: randomColor(),
    inactiveTintColor: randomColor(),
    iconGroup: 'ionicon',
    iconName: 'browsers',
    focusedIconName: 'browsers-outline'
}

export const groupChatParams = messagesParams

export const manageGroupsParams: NavigationParams = {
    activeTintColor: randomColor(),
    inactiveTintColor: randomColor(),
    iconGroup: 'ionicon',
    iconName: 'build',
    focusedIconName: 'build-outline'
}
export const manageUserRolesParams = manageGroupsParams

export const playgroundParams: NavigationParams = {
    activeTintColor: randomColor(),
    inactiveTintColor: randomColor(),
    iconGroup: 'ionicon',
    iconName: 'bug',
    focusedIconName: 'bug-outline'
}