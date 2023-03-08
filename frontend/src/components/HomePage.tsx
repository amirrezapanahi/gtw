import { useEffect, useContext, useState } from "react";
import React from "react";
import { DocList } from "./DocList";
import { Document } from "../types/types"
import { GlobalState } from "../GTWContext";
import { GTW } from "../LocalStorage";
import { read } from "fs";

export const HomePage: React.FC = () => {
  const [state, setState] = useContext(GlobalState);
  const { addDoc, setGTW, getGTW,  } = GTW()

  const [addDocBool, setAddDocBool] = useState<boolean>(false);
  const [importDoc, setImportDoc] = useState<boolean>(false);
  const [docName, setDocName] = useState<string>();
  const [reviewFreq, setReviewFreq] = useState<number>();

  const updateReviewDueAllDocs = (docs: Document[]): void => {
    for (let i = 0; i < docs.length - 1; i++) {
      docs[i] = new Document(docs[i].doc_name, docs[i].review_freq).fromJSON(docs[i])
      docs[i].daysUntilReview = new Document(docs[i].doc_name, docs[i].review_freq).reviewDue()
    }

    setGTW(docs)
    setState(docs)
  }

  useEffect(() => {
    updateReviewDueAllDocs(getGTW())
    console.log("updated: " + getGTW())
  }, [])

  const requestToRegisterDoc = () => {
    setAddDocBool(!addDocBool);
  }

  const requestToImportDoc = () => {
    setImportDoc(!importDoc);
  }

  const registerDoc = () => {
    let doc = new Document(docName!, reviewFreq!);
    addDoc(doc)

    if (state != null) {
      setState(getGTW());
    } else {
      setState([doc])
    }

    setAddDocBool(!addDocBool);
  }

  const importDocument = () => {
    // @ts-ignore
    var input: HTMLInputElement = document.getElementById('file')
    var file = input.files[0]
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(evt) {
        const result = reader.result as string;
        const doc = JSON.parse(result) as any;
        console.log(doc)
        addDoc(doc)
      }
      reader.onerror = function(evt) {
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
          state != null ? <DocList docs={state} /> : <></>
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
              <input type="file" name="file" id="file" accept=".gtw" />
              <button onClick={importDocument}>Import</button>
            </div> :
            <></>
        }
      </div>
    </div>
  );
}