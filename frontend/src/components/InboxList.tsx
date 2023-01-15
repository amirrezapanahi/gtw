import React from 'react'
import {TaskType} from '../types/types'

interface Props{
    tasks: TaskType[]
}

export const InboxList: React.FC<Props> = ({tasks}) => {
  return (
        <li>
        {
            tasks.map(task => {
                return <ul>{task.description}</ul>
            })
        }
        </li>
  )
}
