import React, {useState} from 'react'
import { Inbox } from './Inbox'
import MyEditor from '../components/editor/MyEditor'
import DocumentType from '../types/doc'
import { useParams } from 'react-router-dom'

export const DocumentComponent: React.FC = () => {
  let {id} = useParams();
  
  const getDoc = (): DocumentType => {
    let docs = JSON.parse(localStorage.getItem('gtw')!)
    console.log(docs)
    console.log(docs[0])
    return docs[parseInt(id!,10)];
  }

  const [saved, setSaved] = useState<boolean>(false);
  const [doc, setDoc] = useState<DocumentType>(getDoc())  
  
  return (
    <div style={{"display": "flex"}}>
        <div style={{"width": "50%"}}>
            <Inbox/><br></br>
        </div>
        <div style={{"width": "50%"}}>
          {/* <DocEditor content={doc.content} docIndex={parseInt(id!, 10)}/> */}
          <MyEditor />
        </div>
    </div>
  )
}
