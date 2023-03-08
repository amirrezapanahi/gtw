import React, { useState } from "react"
import { Priority, TaskType } from "../types/types";
import { Link } from "react-router-dom";

interface Props {
  docIndex: number
  taskIndex: number
  task: TaskType;
  overdue: boolean;
}

export const TaskListing: React.FC<Props> = ({ docIndex, taskIndex, task, overdue }) => {

  const [priority] = useState<string>(() => {
    switch (task.priority) {
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
      <td style={{ textAlign: "left" }}><Link to={`/docs/${docIndex}/task/${taskIndex}`} state={{ docIndex: docIndex, task: task }}> {task.description} </Link></td>
      <td style={overdue ? { color: "red", fontWeight: 'bold' } : {}}>{task.dueDate}</td>
      <td>{priority}</td>
      {task.dependentOn ?
        <td>
          <Link to={`/docs/${docIndex}/task/${task.dependentOn.taskID}`} state={{ docIndex: docIndex, task: task.dependentOn }}>
            {task.dependentOn.description}
          </Link></td>
        : <td></td>
      }
      {/*TODO: change this later on to to clickable button/link which takes to a new component*/}
      <td style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex' }}>
          <button><i className="fa-solid fa-bed"></i></button>
          <button><i className="fa-solid fa-pen"></i></button>
          <button><i className="fa-solid fa-trash"></i></button>
          <button><i className="fa-solid fa-check"></i></button>
        </div>
      </td>
    </>
  )
}
