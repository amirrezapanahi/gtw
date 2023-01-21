import React, { useState } from "react"
import { Priority, TaskType } from "../types/types";

interface Props{
    task: TaskType;
}

export const TaskListing: React.FC<Props> = ({task}) => {

    const [priority] = useState<string>(() => {
        switch (task.priority) {
            case 0: {
                return "High"
                break; 
            }
            case 1: {
                return "Mid"
                break; 
            }
            case 2: {
                return "Low"
                break; 
            }
        }
    })

    return (
        <>
        <td style={{textAlign: "left"}}>{task.description}</td>
        <td>{task.dueDate}</td>
        <td>{priority}</td>
        { task.dependentOn ? <td>{task.dependentOn.description}</td> : <td></td>}
        {/*TODO: change this later on to to clickable button/link which takes to a new component*/}
            <td>
                <div style={{display: 'flex'}}>
                    <button><i className="fa-solid fa-bed"></i></button>
                    <button><i className="fa-solid fa-pen"></i></button>
                    <button><i className="fa-solid fa-trash"></i></button>
                    <button><i className="fa-solid fa-check"></i></button>
                </div>
            </td>
        </>
        )
}
