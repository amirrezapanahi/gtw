import React, {useContext, useState} from "react";
import {CaptureBlock} from "./CaptureBlock";
import {Block} from "./Block";
import {GlobalState} from "../GTWContext";
import {TaskType} from "../types/types";
import {Inbox} from "./Inbox";
import { InboxList } from "./InboxList";

interface Props{
    docIndex: number
}
export const Dashboard: React.FC<Props> = ({docIndex}) => {
    const {state} = useContext(GlobalState)
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
                <InboxList docIndex={docIndex} tasks={tasks} meetsCondition={isOverdue} showResolved={false}/>
            </Block>
            <Block docIndex={docIndex} blockName={"Due Soon"}>

            </Block>
        </div>
    )
}
