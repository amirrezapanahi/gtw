import { Badge, Title } from "@mantine/core";
import React from "react";

interface Props {
  docIndex: number
  blockName: string
  children: React.ReactNode
  style: React.CSSProperties
}

export const Block: React.FC<Props> = ({ children, blockName, style }) => {
  return (
    <div className='block' style={style}>
      <div style={blockName !== "Assistant" ? { display: 'inline' } : {
        display: 'grid',
        gridTemplateColumns: 'min-content min-content',
        width: '95%',
        margin: '0 auto'
      }}>
        {blockName !== "" ?
          <>
            <Title order={3}>{blockName}</Title>
            {
              blockName === "Assistant" ? <Badge color="green" variant="outline" style={{
                marginLeft: '1em',
                transform: 'translateY(30%)'
              }}
                title="GPT-3 is a large language model developed by OpenAI that uses deep learning algorithms to generate human-like text and perform various natural language processing tasks."
              >GPT-3</Badge> : <></>
            }
          </> :
          <></>}
      </div>
      <hr></hr>
      {children}
    </div>
  )
}
