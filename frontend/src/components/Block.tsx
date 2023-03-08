import React from "react";

interface Props{
    docIndex: number
    blockName: string
    children: React.ReactNode
}
export const Block: React.FC<Props> = ({children, blockName}) => {
    return (
        <div className='block'>
            <h3>{blockName}</h3>
            <hr></hr>
            {children}
        </div>
    )
}
