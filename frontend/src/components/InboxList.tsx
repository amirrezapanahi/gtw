import React, { useContext, useState } from 'react'
import { TaskType } from '../types/types'
import { TaskListing } from './TaskListing'
import { GTW } from '../LocalStorage'
import { GlobalState } from "../GTWContext";
import '../styles/InboxList.css'

interface Props {
  docIndex: number
  tasks: TaskType[]
  meetsCondition: (obj: any) => boolean
}

export const InboxList: React.FC<Props> = ({ docIndex, tasks, meetsCondition }) => {
  const { getGTW } = GTW()
  const {state, setState} = useContext(GlobalState)

  console.log(state)

  return (
    <>
      <thead>
        <tr className={'inbox-list-headers'}>
          <th>Description</th>
          <th>Due Date</th>
          <th>Priority</th>
          <th>Dependent On</th>
          <th>Operations</th>
        </tr>
        <tr style={{ height: '5px' }}></tr>
      </thead>
      <tbody>
        {
          meetsCondition != null ?
            state[docIndex]._inbox.filter((task: TaskType) => meetsCondition(task)).map((task: TaskType, i: number) => {
              return <tr key={i}><TaskListing docIndex={docIndex} taskIndex={task.taskID - 1} task={task} ></TaskListing></tr>
            })
            :
            state[docIndex]._inbox.map((task: TaskType, i: number) => {
              return <tr key={i}><TaskListing docIndex={docIndex} taskIndex={task.taskID - 1} task={task} ></TaskListing></tr>
            })

        }
      </tbody>
    </>
  )
}
