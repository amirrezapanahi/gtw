import React from "react";
import "./index.css"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import HomePage from "./components/HomePage";
import Document from "./components/Document";

export default function App(){
  return (
      <Routes>
        <Route path="/" element={<HomePage/>}/>        
        <Route path="/docs/:id" element={<Document />}/>
      </Routes>
  )
}
