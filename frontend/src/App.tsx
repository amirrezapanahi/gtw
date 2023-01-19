import React, {createContext, useState} from "react";
import "./index.css"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { DocumentComponent } from "./components/DocumentComponent";
import {GlobalState} from "./GTWContext";
// import {Document} from "./types/types";
import Document from "./types/doc"
export const App: React.FC = () => {

    const [state, setState] = useState<Document[]>(JSON.parse(localStorage.getItem('gtw')))

    return (
      <GlobalState.Provider value={{state, setState}}>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/docs/:id" element={<DocumentComponent />}/>
          </Routes>
      </GlobalState.Provider>
  )
}
