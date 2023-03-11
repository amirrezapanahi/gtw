import React, { useContext, useState } from "react"
import { Priority, TaskType } from "../types/types";
import { Link } from "react-router-dom";
import { GTW } from '../LocalStorage'
import { GlobalState } from "../GTWContext";

interface Props {
  docIndex: number
  taskIndex: number
  task: TaskType;
}

export const TaskListing: React.FC<Props> = ({ docIndex, taskIndex, task }) => {

  const { state, setState } = useContext(GlobalState)
  const { removeTask, snoozeTask, completeTask, getGTW } = GTW();

  const isOverdue = (dueDate: string) => {
    const date = new Date(dueDate).getTime()
    const currentDate = new Date().getTime()
    return date - currentDate < 0
  }

  const taskFromState = state[docIndex]._inbox.find(element => element.taskID == taskIndex + 1)
  if (taskFromState === undefined) {
    throw new TypeError("the value was promised to always be there")
  }

  const [priority] = useState<string>(() => {
    switch (state[docIndex]._inbox.find(element => element.taskID == taskIndex + 1).priority) {
      case 0: {
        return "High"
      }
      case 1: {
        return "Mid"
      }
      case 2: {
        return "Low"
      }
    }
  })

  return (
    <>
      <td style={{ textAlign: "left" }}>
        <Link to={`/docs/${docIndex}/task/${taskIndex}`} state={{ docIndex: docIndex, task: task }}>
          <span className={'task-cell'}>{task.description}</span>
        </Link></td>
      <td style={isOverdue(state[docIndex]._inbox.find((element: any) => element.taskID == taskIndex + 1).dueDate) ? { color: "red", fontWeight: 'bold' } : {}}>
        {state[docIndex]._inbox.find(element => element.taskID == taskIndex + 1).dueDate}
      </td>
      <td>{priority}</td>
      {state[docIndex]._inbox.find(element => element.taskID == taskIndex + 1).dependentOn ?
        <td>
          <Link to={`/docs/${docIndex}/task/${task.dependentOn.taskID}`} state={{ docIndex: docIndex, task: task.dependentOn }}>
            <span className={'task-cell'}>{state[docIndex]._inbox.find(element => element.taskID == taskIndex + 1).dependentOn.description}</span>
          </Link></td>
        : <td></td>
      }
      <td style={{ justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', maxWidth: '100%' }}>
          <button onClick={() => {
            snoozeTask(docIndex, task.taskID)
            setState(getGTW())
          }}><i className="fa-solid fa-bed"></i></button>
          <button>
            <Link to={`/docs/${docIndex}/task/${taskIndex}`} state={{ docIndex: docIndex, task: task }}>
              <i className="fa-solid fa-pen"></i>
            </Link>
          </button>
          <button onClick={() => {
            const doc = getGTW()[docIndex];
            for (let i = 0; i<doc._inbox.length; i++){
              if (doc._inbox[i].dependentOn && (doc._inbox[i].dependentOn.taskID == task.taskID)){
              removeTask(docIndex, doc._inbox[i].taskID)
              }
            }
            removeTask(docIndex, task.taskID)
            setState(getGTW())
          }}><i className="fa-solid fa-trash"></i></button>
          <button onClick={() => {
            completeTask(docIndex, task.taskID)
            setState(getGTW())
          }}><i className="fa-solid fa-check"></i></button>
        </div>
      </td>
    </>
  )
}
