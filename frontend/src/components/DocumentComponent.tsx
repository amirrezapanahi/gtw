import React, { useContext, useEffect, useState } from 'react'
import { DocEditor } from './Editor'
import { Link, useParams } from 'react-router-dom'
import { GlobalState } from "../GTWContext";
import { Document, TaskType, Status } from "../types/types"
import { Dashboard } from "./Dashboard";
import { GTW } from "../LocalStorage";
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import {EditableText} from './EditableText'

export const DocumentComponent: React.FC = () => {
  let { id } = useParams();

  const { getDocIndex } = GTW();
  const { state, setState } = useContext(GlobalState)

  const [isDashboard, onDashboard] = useState<boolean>(true)
  const [saved, setSaved] = useState<boolean>(false);
  const [doc, setDoc] = useState<Document>(state[getDocIndex(parseInt(id!, 10))])

  useEffect(() => {
    console.log("getDocIndex: " + getDocIndex(parseInt(id))) 
  },[])

  return (
    <div style={{ "display": "flex", overflow: 'hidden'}}>
      <div style={{ "width": "50%", maxHeight: '100vh' }}>
        <div className='header'>
          <Link to={`/`} style={{ justifyContent: 'left' }}><IconArrowNarrowLeft /></Link>
          <div style={{ display: 'flex', gap: '2em' }}>
            <Link to={`/docs/${id}/dashboard`}><span>Dashboard</span></Link>
            <Link to={`/docs/${id}/inbox`}><span>Inbox ({state[getDocIndex(parseInt(id!, 10))]._inbox.filter((x: TaskType) => x.status != Status.Done).length})</span></Link>
          </div>
        </div>
            <Dashboard docIndex={parseInt(id,10)} />

      </div>
      <div style={{ "width": "50%", maxHeight: '100vh'  }}>
        <div className='header'>
          <EditableText docIndex={getDocIndex(parseInt(id!, 10))} taskIndex={0} text={doc.doc_name} type={"doc"}/>
        </div>
        <DocEditor docIndex={getDocIndex(parseInt(id!, 10))} showReview={false} handleResponse={null} handleLoading={null} isEditorEmpty={()=>{}} position={null}/>
      </div>
    </div>
  )
}
