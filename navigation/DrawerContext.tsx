import React, { createContext, useState, useEffect } from 'react'

type ContextType = {
    // getBadge: (routeName: string) => string
    // setBadge: (routeName: string, value: string) => void
}

export const DrawerContext = createContext<ContextType>({
    // getBadge: ,
    // setBadge: (routeName: string, value: string) => undefined
})

interface Props {
    children: JSX.Element | JSX.Element[]
}

export const DrawerProvider = ({ children }: Props) => {
    const [badges, setBadges] = useState<string[]>([])
    return (
        <DrawerContext.Provider
            value={{
                getBadges: (value: string) => '0',
                setBadges
            }}
        >
            {children}
        </DrawerContext.Provider>
    )
}