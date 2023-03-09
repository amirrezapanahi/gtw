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

export const TaskListing: React.FC<Props> = ({ docIndex, taskIndex, task}) => {

  const {state, setState} = useContext(GlobalState)
  const { removeTask, snoozeTask, completeTask, getGTW } = GTW();

  const isOverdue = (dueDate: string) => {
    const date = new Date(dueDate).getTime()
    const currentDate = new Date().getTime()
    return date - currentDate < 0
  }

  const taskFromState = state[docIndex]._inbox.find(element => element.taskID == taskIndex+1)
  if (taskFromState === undefined){
    throw new TypeError("the value was promised to always be there")
  }
  
  console.log(taskIndex)
  console.log(taskFromState)

  const [priority] = useState<string>(() => {
    switch (state[docIndex]._inbox.find(element => element.taskID == taskIndex+1).priority) {
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
         {task.description} 
        </Link></td>
      <td style={isOverdue(state[docIndex]._inbox.find((element: any) => element.taskID == taskIndex+1).dueDate) ? { color: "red", fontWeight: 'bold' } : {}}>
        {state[docIndex]._inbox.find(element => element.taskID == taskIndex+1).dueDate}
      </td>
      <td>{priority}</td>
      {state[docIndex]._inbox.find(element => element.taskID == taskIndex+1).dependentOn ?
        <td>
          <Link to={`/docs/${docIndex}/task/${task.dependentOn.taskID}`} state={{ docIndex: docIndex, task: task.dependentOn }}>
            {state[docIndex]._inbox.find(element => element.taskID == taskIndex+1).dependentOn.description}
          </Link></td>
        : <td></td>
      }
      <td style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', maxWidth: '100%' }}>
          <button onClick={() => {
            snoozeTask(docIndex, taskIndex)
            setState(getGTW())
          }}><i className="fa-solid fa-bed"></i></button>
          <button>
            <Link to={`/docs/${docIndex}/task/${taskIndex}`} state={{ docIndex: docIndex, task: task }}>
              <i className="fa-solid fa-pen"></i>
            </Link>
          </button>
          <button onClick={() => {
            removeTask(docIndex, taskIndex)
            setState(getGTW())
          }}><i className="fa-solid fa-trash"></i></button>
          <button onClick={() => {
            completeTask(docIndex, taskIndex)
            setState(getGTW())
          }}><i className="fa-solid fa-check"></i></button>
        </div>
      </td>
    </>
  )
}
