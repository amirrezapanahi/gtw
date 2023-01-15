import React, { useState } from 'react'
import { InboxList } from './InboxList'
import { TextBox } from './TextBox'
import {TaskType} from '../types/types'

export const Inbox: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([])
  const [addInbox, setAddInbox] = useState<boolean>(false)

  const getContent = (content:string) => {
  }

  const doneClicked = (content:string) => {
    //add task to inbox list
    const task = {} as TaskType
    task.description = content
    setTasks([...tasks, task]);
  }

  return (
    <>
    <div style={{"display": "flex", "gap":"1em"}}>
      <div>Inbox</div>
      <div>{tasks.length}</div>
    </div>
    <InboxList tasks={tasks}/>
    <button onClick={() => setAddInbox(!addInbox)}>Add To Inbox Button</button>
    {
      addInbox ? 
      <>
      <div>Capture</div>
      <TextBox getContent={getContent} doneClicked={doneClicked} readOnly={false}/>
      </>
      : <></>
    }
    </>
  )
}
