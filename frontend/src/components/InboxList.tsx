import React from 'react'
import {TaskType} from '../types/types'
import { TaskListing } from './Task'

interface Props{
    tasks: TaskType[]
}

export const InboxList: React.FC<Props> = ({tasks}) => {
  return (
    <table>
        <thead>
        <tr>
          <th>Description</th>
          <th>Due Date</th>
          <th>Priority</th>
          <th>Dependent On</th>
          <th>Operations</th>
        </tr>
      </thead>
      <tbody>
        {
            tasks.map((task, i) => {
                return <tr key={i}><TaskListing task={task}></TaskListing></tr>
            })
        }
      </tbody>
    </table>
  )
}
