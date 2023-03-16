import { Title } from "@mantine/core";
import React from "react";

interface Props{
    docIndex: number
    blockName: string
    children: React.ReactNode
    style: React.CSSProperties
}
export const Block: React.FC<Props> = ({children, blockName, style}) => {
    return (
        <div className='block' style={style}>
            {blockName !== "" ?     
            <>       
            <Title order={3}>{blockName}</Title>
            <hr></hr>
            </> :
            <></>}
            {children}
        </div>
    )
}
