import React from "react"
import { TaskType } from "../types/types";

interface Props{
    task: TaskType;
}

export const Task: React.FC<Props> = ({task}) => {
    return (
        <>
        <td>{task.description}</td>
        <td>{task.dueDate}</td>
        <td>{task.priority}</td>
        <td>{task.dependentOn.description}</td> //TODO: change this later on to to clickable button/link which takes to a new component 
        <td>{task.priority}</td>
        </>
        )
}
