import React, {useState} from 'react'
import { Inbox } from './Inbox'
import { DocEditor }  from './Editor'
import DocumentType from '../types/doc'
import { useParams } from 'react-router-dom'
import { CaptureBlock } from './CaptureBlock'

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
            <div className='header'>
              <div style={{display: 'flex', gap: '2em'}}>
                <span>Dashboard</span>
                <span>Inbox ({doc._inbox.length})</span>
              </div>
            </div>
            <Inbox/><br></br>
            <CaptureBlock docIndex={parseInt(id)} />
        </div>
        <div style={{"width": "50%"}}>
          <div className='header'>
            {doc.doc_name}
          </div>
          <DocEditor content={doc.content} docIndex={parseInt(id!, 10)}/>
        </div>
    </div>
  )
}
