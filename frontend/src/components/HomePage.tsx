import { useEffect,useState } from "react";
import React from "react";
import { DocList } from "./DocList";
import Document from "../types/doc"

export const HomePage: React.FC = () => {

  const [docs, setDocs] = useState<Document[]>(JSON.parse(localStorage.getItem('gtw')!) || []);
  
  const [addDoc, setAddDoc] = useState<boolean>(false);
  const [docName, setDocName] = useState<string>();
  const [reviewFreq, setReviewFreq] = useState<number>();

  //useEffect(() => {
  //  //retrieve documents from localstorage
  //  if ('gtw' in localStorage){
  //    console.log(localStorage)
  //    const docsFromStorage = localStorage.getItem('gtw');
  //    console.log(docsFromStorage)
  //    setDocs(JSON.parse(docsFromStorage!))
  //  }
  //},[])

  // useEffect(() => {    
  //   localStorage.setItem("gtw", JSON.stringify(docs))
  // }, [docs])
  
  const requestToRegisterDoc = () => {
    setAddDoc(!addDoc);
  }

  const registerDoc = () => {
    // fetch("/register-doc", {
    //     method: "POST",
    //     body: JSON.stringify({input: input})
    // })
    // .then(res => res.json);

    let doc = new Document(docName!,reviewFreq!);
    
    let prev = [...docs];
    setDocs([...prev!, doc]);
    setAddDoc(!addDoc);
    console.log(docs);
}

  return (
    <div className="App">
        <div className="container">
            <h1>Getting Things Written.</h1>
            <h3>Write. Journal. Research.</h3>
            {
              docs != null ? <DocList docs={docs}/> : <></>
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