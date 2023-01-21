import React, { useState } from 'react'
import { InboxList } from './InboxList'
import { TextBox } from './TextBox'
import {TaskType} from '../types/types'
import {useGlobalState} from "../GTWContext";

interface Props {
  docIndex: number
}
export const Inbox: React.FC<Props> = ({docIndex}) => {
  const {state, setState} = useGlobalState()
  const [tasks, setTasks] = useState<TaskType[]>(state[docIndex]._inbox)

  return (
    <InboxList tasks={tasks}/>
  )
}
