import { useEffect,useState } from "react";
import React from "react";
import { DocList } from "./DocList";
import {Document} from "../types/types"
import {useGlobalState} from "../GTWContext";
import {GTW} from "../LocalStorage";
import {read} from "fs";

export const HomePage: React.FC = () => {
    const {state, setState} = useGlobalState()
    const {addDoc} = GTW()

  const [addDocBool, setAddDocBool] = useState<boolean>(false);
    const [importDoc, setImportDoc] = useState<boolean>(false);
    const [docName, setDocName] = useState<string>();
  const [reviewFreq, setReviewFreq] = useState<number>();

  const requestToRegisterDoc = () => {
    setAddDocBool(!addDocBool);
  }

    const requestToImportDoc = () => {
        setImportDoc(!importDoc);
    }

  const registerDoc = () => {
    let doc = new Document(docName!,reviewFreq!);

    if (state != null){
        let prev = [...state];
        setState([...prev!, doc]);
    }else{
        setState([doc])
    }
    setAddDocBool(!addDocBool);
    console.log(state);
}

    const importDocument = () => {
        // @ts-ignore
        var input: HTMLInputElement = document.getElementById('file')
        var file = input.files[0]
        if (file) {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (evt) {
                const result = reader.result as string;
                const doc = JSON.parse(result) as any;
                console.log(doc)
                addDoc(doc)
            }
            reader.onerror = function (evt) {
                alert("error reading file");
            }
        }

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
              addDocBool ?
              <div>
                <input placeholder='Document Name' onChange={e => setDocName(e.target.value)}></input>
                <input placeholder='How often will you review? (days)' onChange={e => setReviewFreq(Number(e.target.value))}></input>
                <button onClick={registerDoc}>Create</button>
              </div> : 
              <></>
            }
            <button onClick={requestToImportDoc}>Import a document</button>
            {
                importDoc ?
                    <div>
                        <input type="file" name="file" id="file" accept=".gtw"/>
                        <button onClick={importDocument}>Import</button>
                    </div> :
                    <></>
            }
        </div>
    </div>
  );
}