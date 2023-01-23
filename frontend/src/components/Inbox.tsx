import React, { useState } from 'react'
import { InboxList } from './InboxList'
import { TextBox } from './TextBox'
import {TaskType} from '../types/types'
import {useGlobalState} from "../GTWContext";

interface Props {
    docIndex: number
    condition: () => any

}
export const Inbox: React.FC<Props> = ({docIndex, condition}) => {
  const {state, setState} = useGlobalState()
  const [tasks, setTasks] = useState<TaskType[]>(state[docIndex]._inbox)

  return (
      <table className={'block inbox-list'}>
        <thead>
        <tr>
          <th>Description</th>
          <th>Due Date</th>
          <th>Priority</th>
          <th>Dependent On</th>
          <th>Operations</th>
        </tr>
        <tr style={{height: '5px'}}></tr>
        </thead>
        <tbody>
          <InboxList docIndex={docIndex} tasks={tasks} />
        </tbody>
      </table>
  )
}
