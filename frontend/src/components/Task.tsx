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
        <td>{task.description}</td>
        <td>{task.dueDate}</td>
        <td>{priority}</td>
        <td>{task.dependentOn.description}</td> 
        //TODO: change this later on to to clickable button/link which takes to a new component 
        </>
        )
}
