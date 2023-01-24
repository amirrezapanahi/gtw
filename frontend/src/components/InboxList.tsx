import React from 'react'
import {TaskType} from '../types/types'
import { TaskListing } from './TaskListing'

interface Props{
    docIndex: number
    tasks: TaskType[]
    meetsCondition: (obj: any) => boolean
}

export const InboxList: React.FC<Props> = ({docIndex, tasks, meetsCondition}) => {

    const isOverdue = (dueDate: string) => {
        const date = new Date(dueDate).getTime()
        const currentDate = new Date().getTime()
        console.log(currentDate - date)
        return date - currentDate < 0
    }

    return (
        <>
        {
            meetsCondition != null ?
            tasks.filter(task => meetsCondition(task)).map((task, i) => {
                return <tr key={i}><TaskListing docIndex={docIndex} taskIndex={i} task={task} overdue={isOverdue(task.dueDate)}></TaskListing></tr>
            })
            :
            tasks.map((task, i) => {
                return <tr key={i}><TaskListing docIndex={docIndex} taskIndex={i} task={task} overdue={isOverdue(task.dueDate)}></TaskListing></tr>
            })
        }
        </>
  )
}
