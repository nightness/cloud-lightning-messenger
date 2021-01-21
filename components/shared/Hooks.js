import { useState, useMemo, useEffect, useRef, useCallback } from 'react'

export const newState = (oldState, modifyFunction) => {
    console.log(oldState)
    const newState = typeof ('array') ? [...oldState] : typeof ('object') ? { ...oldObject } : null
    return modifyFunction(newState)
}

export const useValidatedState = (initialValue, isValid, invalidated) => {
    const [value, setValue] = useState(isValid(initialValue) ? initialValue : undefined)
    const wrapSetValue = value => isValid(value) ? setValue(value) : invalidated()
    return [value, wrapSetValue]
}

// Returns a decreaseCount function; and that decrements and returns the new value (doesn't rerender the component)
export const useDecrementer = (initialValue) => useMemo(() => {
    let count = initialValue
    return () => --count
}, []);

// Returns an increaseCount function; and that increments and returns the new value (doesn't rerender the component)
export const useIncrementer = initialValue => useMemo(() => {
    let count = initialValue
    return () => ++count
}, [])

// Returns [get, set] for a persistent value that's set function doesn't rerender the component
export const useValue = initialValue => {
    useMemo(() => {
        let currentValue = initialValue
        return [
            () => currentValue,
            newValue => (currentValue = newValue)
        ]
    }, [])
}

// returns [currentState, previousState, setState]
export const useStateChanged = initialState => {
    const previousState = useRef()
    const [state, setState] = useState(initialState)

    useEffect(() => {
        previousState.current = state
    }, [state])

    return [state, previousState.current, setState]
}

// A 'data' prop alternative??? Just send the changes in state across the bridge!
// returns [{ state, added, removed }, setState]
export const useStateDifferences = initialState => {
    const previousState = useRef()
    const [state, setState] = useState(initialState)
    let added, removed, _previousValue;

    // Update the previousState
    useEffect(() => {
        previousState.current = state
    }, [state])

    // Find elements added to the state
    added = (state && previousState.current) ?
        state.flatMap(value => {
            const after = _previousValue
            _previousValue = value
            if (previousState.current.includes(value)) return []
            return [{ after, value }]
        })
        : (state) ? [{
            after: undefined,
            value: state[0]
        }] : []

    // Find elements removed from state
    _previousValue = undefined
    removed = (state && previousState.current) ?
        previousState.current.flatMap(value => {
            const after = _previousValue
            _previousValue = value
            if (state.includes(value)) return []
            return [{ after, value }]
        })
        : []

    return [{ state, added, removed }, setState]
}

// The idea here is that this hook maintains a huge data set, but the
// stateful value only contains a window of the entire data set along with
// values to indicate how much data is before and after the windowed state.
export const useDataView = (initialValue, windowSize) => {
    const data = useRef(initialValue)
    const [stateData, setStateData] = useState({
        windowData,
        data,
        preLength,
        postLength,
        windowSize,
    })

    const setWrapper = value => {
        data.current = value
        setStateData(value)
    }

    return {
        stateData,
        setWrapper,
        data
    }
}