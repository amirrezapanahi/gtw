import React, {createContext, Dispatch, SetStateAction, useContext, useState} from 'react';
import {Document} from "./types/types"

// const initialState = {
//     state: {} as Partial<Document[]>,
//     setState: {} as Dispatch<SetStateAction<Partial<Document[]>>>,
// }

const initialState: any = []

export const GlobalState = React.createContext(initialState);

// export const useGlobalState = () => useContext(GlobalState);
const GTWContext = ({children}) => {
    const [context, setContext] = useState(JSON.parse(localStorage.getItem('gtw')))

    return (
        <GlobalState.Provider value={[context, setContext]}>
            {children}
        </GlobalState.Provider>
    )
}

export default GTWContext