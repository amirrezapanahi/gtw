import React from 'react'
import { Inbox } from './Inbox'
import { LivePreview } from './LivePreview'

export const Document: React.FC = () => {
  return (
    <div style={{"display": "flex"}}>
        <div style={{"width": "50%"}}>
            <Inbox/>
        </div>
        <div style={{"width": "50%"}}>
            <LivePreview />
        </div>
    </div>
  )
}
