import React from "react";
import {CaptureBlock} from "./CaptureBlock";
import {Block} from "./Block";

interface Props{
    docIndex: number
}
export const Dashboard: React.FC<Props> = ({docIndex}) => {
    return (
        <div className={'dashboard'}>
            <Block docIndex={docIndex} blockName={"Capture"}>
                <CaptureBlock docIndex={docIndex}/>
            </Block>
            <Block docIndex={docIndex} blockName={"Overdue"}>

            </Block>
            <Block docIndex={docIndex} blockName={"Due Soon"}>

            </Block>
        </div>
    )
}
