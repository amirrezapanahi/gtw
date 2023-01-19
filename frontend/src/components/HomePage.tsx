import { useEffect,useState } from "react";
import React from "react";
import { DocList } from "./DocList";
import Document from "../types/doc"
import {useGlobalState} from "../GTWContext";

export const HomePage: React.FC = () => {
    const {state, setState} = useGlobalState()
  // const [docs, setDocs] = useState<Document[]>(JSON.parse(localStorage.getItem('gtw')!) || []);
  
  const [addDoc, setAddDoc] = useState<boolean>(false);
  const [docName, setDocName] = useState<string>();
  const [reviewFreq, setReviewFreq] = useState<number>();

  const requestToRegisterDoc = () => {
    setAddDoc(!addDoc);
  }

  const registerDoc = () => {
    let doc = new Document(docName!,reviewFreq!);

    if (state != null){
        let prev = [...state];
        setState([...prev!, doc]);
    }else{
        setState([doc])
    }
    setAddDoc(!addDoc);
    console.log(state);
}

  return (
    <div className="App">
        <div className="container">
            <h1>Getting Things Written.</h1>
            <h3>Write. Journal. Research.</h3>
            {
              state != null ? <DocList docs={state}/> : <></>
            }
            <button onClick={requestToRegisterDoc}>Create a document</button>
            {
              addDoc ?         
              <div>
                <input placeholder='Document Name' onChange={e => setDocName(e.target.value)}></input>
                <input placeholder='How often will you review? (days)' onChange={e => setReviewFreq(Number(e.target.value))}></input>
                <button onClick={registerDoc}>Create</button>
              </div> : 
              <></>
            }
        </div>
    </div>
  );
}