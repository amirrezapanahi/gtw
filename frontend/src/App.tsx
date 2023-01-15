import React from "react";
import "./index.css"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { DocumentComponent } from "./components/DocumentComponent";

export const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<HomePage/>}/>        
        <Route path="/docs/:id" element={<DocumentComponent />}/>
      </Routes>
  )
}
