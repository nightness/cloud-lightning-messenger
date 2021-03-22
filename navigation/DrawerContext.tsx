import React, { createContext, useState, useEffect } from 'react'

type ContextType = {
    test: string
}

export const DrawerContext = createContext<ContextType>({
    test: 'Hello World'
})

interface Props {
    children: JSX.Element | JSX.Element[]
}

export const DrawerProvider = ({ children }: Props) =>
    <DrawerContext.Provider
        value={{
            test: 'Hello World'
        }}
    >
        {children}
    </DrawerContext.Provider>
