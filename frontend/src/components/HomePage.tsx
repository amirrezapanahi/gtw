import { useEffect,useState } from "react";
import React from "react";
import DocList from "./DocList";

function HomePage() {

  const [docs, setDocs] = useState<string[]>([]);
  const [addDoc, setAddDoc] = useState<boolean>(false);
  const [input, setInput] = useState<string>();

  useEffect(() => {
    //retrieve documents from db 
    fetch('/docs')
      .then(res => res.json())
      .then(data => setDocs(data))
  },[])
  
  const requestToRegisterDoc = () => {
    setAddDoc(!addDoc);
  }

  const registerDoc = () => {
    // fetch("/register-doc", {
    //     method: "POST",
    //     body: JSON.stringify({input: input})
    // })
    // .then(res => res.json);
    
    let prev = [...docs];
    setDocs([...prev!, input!]);
    setAddDoc(!addDoc);
    console.log(docs);
}

  return (
    <div className="App">
        <div className="header">
            <h3>Login/Register</h3>
        </div>
        <div className="container">
            <h1>Getting Things Written.</h1>
            <h3>Write. Journal. Research.</h3>
            <DocList docs={docs}/>
            <button onClick={requestToRegisterDoc}>Create a document</button>
            {
              addDoc ?         
              <div>
                <input placeholder='Document Name' onChange={e => setInput(e.target.value)}></input>
                <button onClick={registerDoc}>Create</button>
              </div> : 
              <></>
            }
        </div>
    </div>
  );
}

export default HomePage;