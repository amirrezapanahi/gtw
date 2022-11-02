import React, {useState} from 'react'
import { Inbox } from './Inbox'
import { LivePreview } from './LivePreview'
import {TextBox} from './TextBox'

export const Document: React.FC = () => {

  const [writtenContent, setWrittenContent] = useState<string>("");
  const [completed, setCompleted] = useState<boolean>(false);
  
  const getContent = (content:string) => {
      setWrittenContent(content);
  }

  const doneClicked = (content:string) => {
    setCompleted(!completed);
  }
  
  return (
    <div style={{"display": "flex"}}>
        <div style={{"width": "50%"}}>
            <Inbox/>
            <TextBox getContent={getContent} doneClicked={doneClicked}/>
        </div>
        <div style={{"width": "50%"}}>
            <LivePreview displayContent={writtenContent} saveContent={completed} setWrittenContent={setWrittenContent}/>
        </div>
    </div>
  )
}
