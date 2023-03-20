import React, { useContext, useState } from 'react'
import { DocEditor } from './Editor'
import { Link, useParams } from 'react-router-dom'
import { GlobalState } from "../GTWContext";
import { Document, TaskType, Status } from "../types/types"
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import { Inbox } from './Inbox';
import { GTW } from '../LocalStorage';

export const DocumentComponentInbox: React.FC = () => {
  let { id } = useParams();

  const { state } = useContext(GlobalState)
  const { getDocIndex } = GTW()

  const [doc] = useState<Document>(state[getDocIndex(parseInt(id!, 10))])

  return (
    <div style={{ "display": "flex", overflow: 'hidden' }}>
      <div style={{ "width": "50%" }}>
        <div className='header'>
          <Link to={`/`} style={{ justifyContent: 'left' }}><IconArrowNarrowLeft /></Link>
          <div style={{ display: 'flex', gap: '2em' }}>
            <Link to={`/docs/${id}/dashboard`}><span>Dashboard</span></Link>
            <Link to={`/docs/${id}/inbox`}><span>Inbox ({state[getDocIndex(parseInt(id,10))]._inbox.filter((x: TaskType) => x.status != Status.Done).length})</span></Link>
          </div>
        </div>
            <Inbox docIndex={getDocIndex(parseInt(id))} condition={null} />
      </div>
      <div style={{ "width": "50%" }}>
        <div className='header'>
          {doc.doc_name}
        </div>
        <DocEditor docIndex={getDocIndex(parseInt(id!, 10))} showReview={false} handleResponse={null} handleLoading={null} isEditorEmpty={()=>{}} position={null}/>
      </div>
    </div>
  )
}
