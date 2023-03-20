import { useEffect, useContext, useState } from "react";
import React from "react";
import { DocList } from "./DocList";
import { Document } from "../types/types"
import { GlobalState } from "../GTWContext";
import { GTW } from "../LocalStorage";
import { read } from "fs";
import { Text } from "@mantine/core";

export const HomePage: React.FC = () => {
  const {state, setState} = useContext(GlobalState);
  const { addDoc, setGTW, getGTW, localStorageSizePercentage } = GTW()

  const [addDocBool, setAddDocBool] = useState<boolean>(false);
  const [importDoc, setImportDoc] = useState<boolean>(false);
  const [docName, setDocName] = useState<string>();
  const [reviewFreq, setReviewFreq] = useState<number>();

  const updateReviewDueAllDocs = (docs: Document[]): void => {
    for (let i = 0; i < docs.length - 1; i++) {
      docs[i] = new Document(docs[i].doc_name, docs[i].review_freq, docs[i].docID).fromJSON(docs[i])
      docs[i].daysUntilReview = new Document(docs[i].doc_name, docs[i].review_freq, docs[i].docID).reviewDue()
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
    let doc = new Document(docName!, reviewFreq!, getGTW().length+1);
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
        const doc = JSON.parse(result) as Document;
        console.log(doc)
        const newid = getGTW().length + 1
        doc.docID = newid
        for (let i = 0; i<doc._inbox.length; i++){
          doc._inbox[i].projectID = newid 
        }
        addDoc(doc)
        setState(getGTW())
      }
      reader.onerror = function(evt) {
        alert("error reading file");
      }
    }

  }

  return (
    <div className="App" style={{width: '100%', display: 'grid'}}>
      <div className="container">
        <h1>Getting Things Written.</h1>
        <br></br>
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
      <Text fz="sm" ta="center" style={{marginTop: '2em'}}>
        Consolidate your thoughts and ideas with this powerful writing tool which adopts the 'Getting Things Done' methodology
        by David Allen. <strong>'Getting Things Written'</strong> provide a productive writing experience. Make context switching across different documents a breeze
        and never feel flustered again.
      </Text>      
      </div>
      <Text fz='xs' c="dimmed" style={{display: 'block', margin: '0 auto', marginTop: '5em'}}>Storage Used: {localStorageSizePercentage().toPrecision(3)} %</Text>
      <Text fz='xs' c="dimmed" style={{display: 'block', margin: '0 auto', fontSize: '10px', marginTop: '2em'}}>
        <strong>Privacy notice</strong>: This webpage simply downloads the Getting Things Written application to your browser.
        Once loaded, everything runs locally in your browser. No data is sent back to the server.
        </Text>
    </div>
  );
}