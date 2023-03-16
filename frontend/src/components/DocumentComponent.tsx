import React, { useContext, useState } from 'react'
import { DocEditor } from './Editor'
import { Link, useParams } from 'react-router-dom'
import { GlobalState } from "../GTWContext";
import { Document, TaskType, Status } from "../types/types"
import { Dashboard } from "./Dashboard";
import { GTW } from "../LocalStorage";
import { IconArrowNarrowLeft } from '@tabler/icons-react';

export const DocumentComponent: React.FC = () => {
  let { id } = useParams();

  const { getGTW } = GTW();
  const { state, setState } = useContext(GlobalState)

  const [isDashboard, onDashboard] = useState<boolean>(true)
  const [saved, setSaved] = useState<boolean>(false);
  const [doc, setDoc] = useState<Document>(state[parseInt(id!, 10)])

  return (
    <div style={{ "display": "flex", overflow: 'hidden'}}>
      <div style={{ "width": "50%", maxHeight: '100vh' }}>
        <div className='header'>
          <Link to={`/`} style={{ justifyContent: 'left' }}><IconArrowNarrowLeft /></Link>
          <div style={{ display: 'flex', gap: '2em' }}>
            <Link to={`/docs/${id}/dashboard`}><span>Dashboard</span></Link>
            <Link to={`/docs/${id}/inbox`}><span>Inbox ({state[id!]._inbox.filter((x: TaskType) => x.status != Status.Done).length})</span></Link>
          </div>
        </div>
            <Dashboard docIndex={parseInt(id)} />
      </div>
      <div style={{ "width": "50%", maxHeight: '100vh'  }}>
        <div className='header'>
          {doc.doc_name}
        </div>
        <DocEditor content={doc.content} docIndex={parseInt(id!, 10)} />
      </div>
    </div>
  )
}
