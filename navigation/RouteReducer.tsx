import { Screens, ScreenConfig } from './NavigationTypes'

export type ReducerActionType = 'insert' | 'remove'

export type ReducerAction = {
    type: ReducerActionType
    screen?: ScreenConfig
    index?: number
    name?: string
}

export const RoutingReducer = (currentState: Screens, action: ReducerAction) => {
    switch (action.type) {
        case 'insert': {
            if (typeof action.index === 'number' && action.screen) {
                currentState.splice(action.index, 0, action.screen )
                return [...currentState]
            }
            return currentState
        }
        case 'remove': {
            // requires only type and (index or name)
            if (typeof action.index === 'number') {
                currentState.splice(action.index, 1)
                return [...currentState]
            }
            return currentState
        }
    }
}
