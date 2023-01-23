import React, {useState} from "react";
import {CaptureBlock} from "./CaptureBlock";
import {Block} from "./Block";
import {InboxList} from "./InboxList";
import {useGlobalState} from "../GTWContext";
import {TaskType} from "../types/types";
import {Inbox} from "./Inbox";

interface Props{
    docIndex: number
}
export const Dashboard: React.FC<Props> = ({docIndex}) => {
    const {state, setState} = useGlobalState()
    const [tasks] = useState<TaskType[]>(state[docIndex]._inbox)

    const showOverdue = () => {

    }

    return (
        <div className={'dashboard'}>
            <Block docIndex={docIndex} blockName={"Capture"}>
                <CaptureBlock docIndex={docIndex}/>
            </Block>
            <Block docIndex={docIndex} blockName={"Overdue"}>
                <Inbox docIndex={docIndex} condition={showOverdue}/>
            </Block>
            <Block docIndex={docIndex} blockName={"Due Soon"}>

            </Block>
        </div>
    )
}
