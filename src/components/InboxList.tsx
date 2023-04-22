import React, { useContext, useState } from 'react'
import { TaskType, Status } from '../types/types'
import { TaskListing } from './TaskListing'
import { GTW } from '../LocalStorage'
import { GlobalState } from "../GTWContext";
import '../styles/InboxList.css'

interface Props {
  docIndex: number
  tasks: TaskType[]
  meetsCondition: (obj: any) => boolean
  showResolved: boolean
}

export const InboxList: React.FC<Props> = ({ docIndex, tasks, meetsCondition, showResolved }) => {
  const { getGTW, getTaskIndex } = GTW()
  const { state, setState } = useContext(GlobalState)

  console.log(state)

  return (
    <>
      <thead>
        <tr className={'inbox-list-headers'}>
          <th>Description</th>
          <th>Due Date</th>
          <th>Priority</th>
          <th>Dependent On</th>
          {
            showResolved == false ? <th>Operations</th> : <></>
          }
        </tr>
        <tr style={{ height: '5px' }}></tr>
      </thead>
      <tbody>
        {
          meetsCondition != null ?
            state[docIndex]._inbox.filter((task: TaskType) => meetsCondition(task)).map((task: TaskType, i: number) => {
              return <tr key={i} className='taskListing'><TaskListing docIndex={docIndex} taskIndex={getTaskIndex(docIndex,task.taskID)} task={task} ></TaskListing></tr>
            })
            :
            (
              showResolved == true ?
                state[docIndex]._inbox.filter((task: TaskType) => task.status == Status.Done).map((task: TaskType, i: number) => {
                  return <tr key={i} className='taskListing'><TaskListing docIndex={docIndex} taskIndex={getTaskIndex(docIndex,task.taskID)} task={task} ></TaskListing></tr>
                })
                :
                state[docIndex]._inbox.filter((task: TaskType) => task.status != Status.Done).map((task: TaskType, i: number) => {
                  return <tr key={i} className='taskListing'><TaskListing docIndex={docIndex} taskIndex={getTaskIndex(docIndex,task.taskID)} task={task} ></TaskListing></tr>
                })
            )
        }
      </tbody>
    </>
  )
}
