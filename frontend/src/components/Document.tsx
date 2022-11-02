import React, {useState} from 'react'
import { Inbox } from './Inbox'
import { LivePreview } from './LivePreview'
import {TextBox} from './TextBox'

export const Document: React.FC = () => {

  const [writtenContent, setWrittenContent] = useState<string>("");
  
  const getContent = (content:string) => {
      setWrittenContent(content);
  }

  // const saveContent = (content:string)
  
  return (
    <div style={{"display": "flex"}}>
        <div style={{"width": "50%"}}>
            <Inbox/>
            <TextBox getContent={getContent}/>
        </div>
        <div style={{"width": "50%"}}>
            <LivePreview displayContent={writtenContent}/>
        </div>
    </div>
  )
}
