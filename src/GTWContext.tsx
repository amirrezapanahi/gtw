import React, {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from 'react';
import {Document} from "./types/types"

type initialState = {
    state: Document[],
    setState: Dispatch<SetStateAction<Document[]>>,
}

// const initialState: any = []

export const GlobalState = React.createContext<null | initialState>(null);

type ContextProviderProps = {
    children: ReactNode
}

// export const useGlobalState = () => useContext(GlobalState);
const GTWContext = ({children}: ContextProviderProps) => {
    const [state, setState] = useState(JSON.parse(localStorage.getItem('gtw')))
    const value = {
        state,
        setState
    }

    return (
        <GlobalState.Provider value={value}>
            {children}
        </GlobalState.Provider>
    )
}

export default GTWContext