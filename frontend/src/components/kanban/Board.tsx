import React, { useContext, useState } from 'react'
import { GlobalState } from '../../GTWContext'
import { GTW } from '../../LocalStorage'
import { Status } from '../../types/types'

interface Props {
  docIndex: number
  id: string
  className: string
  children: React.ReactNode
}

export const Board: React.FC<Props> = ({ docIndex, id, className, children }) => {

  const { state, setState } = useContext(GlobalState)
  const { getGTW, setGTW, getTask, getTaskIndex, updateTask } = GTW()

  const drop = (e:any) => {
    e.preventDefault()
    const cardID = e.dataTransfer.getData('cardID')
    const cardIDint = parseInt(cardID)
    console.log(typeof cardID)
    console.log(cardID)
    const card = document.getElementById(cardID)
    card.style.display = 'block'

    const updatedTask = getTask(cardIDint, docIndex)
    if (id == 'todoBoard') {
      updatedTask.status = Status.Todo
    } else if (id == 'doingBoard') {
      updatedTask.status = Status.Doing
    } else if (id == 'doneBoard') {
      updatedTask.status = Status.Done
    }

    updateTask(docIndex, cardIDint, updatedTask)
    setState(getGTW())
  }

  const dragOver = (e: any) => {
    e.preventDefault()
  }

  return (
    <div
      id={id}
      className={className}
      onDrop={drop}
      onDragOver={dragOver}
    >
      {children}
    </div>
  )
}
