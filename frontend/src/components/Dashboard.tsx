import React, {useContext, useState} from "react";
import {CaptureBlock} from "./CaptureBlock";
import {Block} from "./Block";
import {InboxList} from "./InboxList";
import {GlobalState} from "../GTWContext";
import {TaskType} from "../types/types";
import {Inbox} from "./Inbox";

interface Props{
    docIndex: number
}
export const Dashboard: React.FC<Props> = ({docIndex}) => {
    const [state] = useContext(GlobalState)
    const [tasks] = useState<TaskType[]>(state[docIndex]._inbox)

    const isOverdue = (task: TaskType) => {
        const currentDate = new Date()
        const currentDateMs = currentDate.getTime()
        const dueDate = new Date(task.dueDate).getTime()
        return (dueDate - currentDateMs) <=  0
    }

    return (
        <div className={'dashboard'}>
            <Block docIndex={docIndex} blockName={"Capture"}>
                <CaptureBlock docIndex={docIndex}/>
            </Block>
            <Block docIndex={docIndex} blockName={"Overdue"}>
                <Inbox docIndex={docIndex} condition={isOverdue}/>
            </Block>
            <Block docIndex={docIndex} blockName={"Due Soon"}>

            </Block>
        </div>
    )
}
