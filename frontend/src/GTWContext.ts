import {createContext, Dispatch, SetStateAction, useContext} from 'react';
import {DocumentType} from "./types/types";
import Document from "./types/doc";
export const GlobalState = createContext({
    state: {} as Partial<Document[]>,
    setState: {} as Dispatch<SetStateAction<Partial<Document[]>>>,
});
export const useGlobalState = () => useContext(GlobalState);