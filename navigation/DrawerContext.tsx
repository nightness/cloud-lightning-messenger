import React, { createContext, useState } from 'react'

type Badges = { [routeName: string] : {} }

type ContextType = {
    badges: Badges
    setBadge: (routeName: string, value: string) => void
}

export const DrawerContext = createContext<ContextType>({
    badges: {},
    setBadge: (routeName: string, value: string) => undefined
})

interface Props {
    children: JSX.Element | JSX.Element[]
}

export const DrawerProvider = ({ children }: Props) => {
    const [badges, setBadges] = useState<Badges>({})

    const setBadge = (routeName: string, value: string): void => {
        let newState = {...badges}
        newState[routeName] = value
        setBadges(newState)
    }

    return (
        <DrawerContext.Provider
            value={{
                badges,
                setBadge
            }}
        >
            {children}
        </DrawerContext.Provider>
    )
}