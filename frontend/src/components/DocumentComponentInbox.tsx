import React, { useContext, useState } from 'react'
import { DocEditor } from './Editor'
import { Link, useParams } from 'react-router-dom'
import { GlobalState } from "../GTWContext";
import { Document, TaskType, Status } from "../types/types"
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import { Inbox } from './Inbox';

export const DocumentComponentInbox: React.FC = () => {
  let { id } = useParams();

  const { state } = useContext(GlobalState)

  const [doc] = useState<Document>(state[parseInt(id!, 10)])

  return (
    <div style={{ "display": "flex" }}>
      <div style={{ "width": "50%" }}>
        <div className='header'>
          <Link to={`/`} style={{ justifyContent: 'left' }}><IconArrowNarrowLeft /></Link>
          <div style={{ display: 'flex', gap: '2em' }}>
            <Link to={`/docs/${id}/dashboard`}><span>Dashboard</span></Link>
            <Link to={`/docs/${id}/inbox`}><span>Inbox ({state[id!]._inbox.filter((x: TaskType) => x.status != Status.Done).length})</span></Link>
          </div>
        </div>
            <Inbox docIndex={parseInt(id)} condition={null} />
      </div>
      <div style={{ "width": "50%" }}>
        <div className='header'>
          {doc.doc_name}
        </div>
        <DocEditor content={doc.content} docIndex={parseInt(id!, 10)} />
      </div>
    </div>
  )
}
