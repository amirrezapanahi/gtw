import React, { useContext, useState } from "react"
import { Priority, TaskType } from "../types/types";
import { Link } from "react-router-dom";
import { GTW } from '../LocalStorage'
import { GlobalState } from "../GTWContext";
import { Badge, Paper } from "@mantine/core";

interface Props {
  docIndex: number
  taskIndex: number
  task: TaskType;
}

export const TaskListing: React.FC<Props> = ({ docIndex, taskIndex, task }) => {

  const { state, setState } = useContext(GlobalState)
  const { getTaskIndex, removeTask, snoozeTask, completeTask, getGTW } = GTW();

  const isOverdue = (dueDate: string) => {
    const currentDateCopy = new Date()
    currentDateCopy.setHours(0, 0, 0, 0)
    const dueDateCopy = new Date(dueDate)
    dueDateCopy.setHours(0, 0, 0, 0)
    return currentDateCopy.getTime() > dueDateCopy.getTime()
  }

  const taskFromState = state[docIndex]._inbox[taskIndex]
  if (taskFromState === undefined) {
    throw new TypeError("the value was promised to always be there")
  }

  const [priority] = useState<string>(() => {
    switch (state[docIndex]._inbox[taskIndex].priority) {
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
        <Link to={`/docs/${task.projectID}/task/${taskIndex}`} state={{ docIndex: docIndex, task: task }}>
          <Badge color="gray.0" variant='outline' style={{ maxWidth: '100%' }} title={task.description}>{task.description}</Badge>
        </Link>
      </td>
      <td style={isOverdue(state[docIndex]._inbox[taskIndex].dueDate) ? { color: "#ff6b6b" } : {}}>
        {state[docIndex]._inbox[taskIndex].dueDate}
      </td>
      <td>{priority}</td>
      {state[docIndex]._inbox[taskIndex].dependentOn ?
        <td>
          <Link to={`/docs/${task.projectID}/task/${getTaskIndex(docIndex, task.dependentOn.taskID)}`} state={{ docIndex: docIndex, task: task.dependentOn }}>
            <Badge color="gray.0" variant='outline' style={{ maxWidth: '100%' }} title={task.dependentOn.description}>{task.dependentOn.description}</Badge>
          </Link></td>
        : <td></td>
      }
      <td style={{ justifyContent: 'center' }}>
        <div className="operations">
          <button title='Snooze (7 Days)' onClick={() => {
            snoozeTask(docIndex, task.taskID)
            setState(getGTW())
          }}><i className="fa-solid fa-bed"></i></button>
          <button title='Edit'>
            <Link to={`/docs/${task.projectID}/task/${taskIndex}`} state={{ docIndex: docIndex, task: task }}>
              <i className="fa-solid fa-pen"></i>
            </Link>
          </button>
          <button title='Delete' onClick={() => {
            const doc = getGTW()[docIndex];
            for (let i = 0; i < doc._inbox.length; i++) {
              if (doc._inbox[i].dependentOn && (doc._inbox[i].dependentOn.taskID == task.taskID)) {
                removeTask(docIndex, doc._inbox[i].taskID)
              }
            }
            removeTask(docIndex, task.taskID)
            setState(getGTW())
          }}><i className="fa-solid fa-trash"></i></button>
          <button title='Complete' onClick={() => {
            completeTask(docIndex, task.taskID)
            setState(getGTW())
          }}><i className="fa-solid fa-check"></i></button>
        </div>
      </td>
    </>
  )
}
