import React from 'react'
import {TaskType} from '../types/types'
import { TaskListing } from './TaskListing'

interface Props{
    docIndex: number
    tasks: TaskType[]
}

export const InboxList: React.FC<Props> = ({docIndex, tasks}) => {

    const isOverdue = (dueDate: string) => {
        const date = new Date(dueDate).getTime()
        const currentDate = new Date().getTime()
        console.log(currentDate - date)
        return date - currentDate < 0
    }

    return (
        <>
        {
            tasks.map((task, i) => {
                return <tr key={i}><TaskListing docIndex={docIndex} taskIndex={i} task={task} overdue={isOverdue(task.dueDate)}></TaskListing></tr>
            })
        }
        </>
  )
}
