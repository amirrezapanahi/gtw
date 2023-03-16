import React, { createContext, useEffect, useState } from "react";
import "./index.css"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { DocumentComponent } from "./components/DocumentComponent";
import GTWContext from "./GTWContext";
// import {Document} from "./types/types";
import { Document } from "./types/types"
import { GTW } from "./LocalStorage";
import { TaskComponent } from "./components/TaskComponent";
import { DocumentComponentInbox } from "./components/DocumentComponentInbox";

export const App: React.FC = () => {

  return (
    <GTWContext>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/docs/:id/dashboard" element={<DocumentComponent />} />
        <Route path="/docs/:id/inbox" element={<DocumentComponentInbox />} />
        <Route path='/docs/:id/task/:taskId' element={<TaskComponent />} />
      </Routes>
    </GTWContext>

  )
}
