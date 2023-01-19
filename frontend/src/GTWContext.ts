import {createContext, Dispatch, SetStateAction, useContext} from 'react';
import {DocumentType} from "./types/types";
export const GlobalState = createContext({
    state: {} as Partial<DocumentType[]>,
    setState: {} as Dispatch<SetStateAction<Partial<DocumentType[]>>>,
});
export const useGlobalState = () => useContext(GlobalState);