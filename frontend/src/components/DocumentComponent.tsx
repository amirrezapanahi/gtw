import React, {useContext, useState} from 'react'
import { Inbox } from './Inbox'
import { DocEditor }  from './Editor'
import {Link, useParams} from 'react-router-dom'
import {GlobalState} from "../GTWContext";
import {Document} from "../types/types"
import {Dashboard} from "./Dashboard";

export const DocumentComponent: React.FC = () => {
  let {id} = useParams();
  const [state, setState] = useContext(GlobalState)

  const [isDashboard, onDashboard] = useState<boolean>(true)
  const [saved, setSaved] = useState<boolean>(false);
  const [doc, setDoc] = useState<Document>(state[parseInt(id!,10)])
  
  return (
    <div style={{"display": "flex"}}>
        <div style={{"width": "50%"}}>
            <div className='header'>
              <div style={{display: 'flex', gap: '2em'}}>
                <span onClick={() => onDashboard(true)}>Dashboard</span>
                <span onClick={() => onDashboard(false)}>Inbox ({state[id!]._inbox.length})</span>
              </div>
            </div>
            {
                isDashboard ?
                    <Dashboard docIndex={parseInt(id)} />
                    :
                    <Inbox docIndex={parseInt(id)} condition={null}/>
            }
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
