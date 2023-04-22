import { Text, Badge, Input, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

interface Props {
  docIndex: number
  blockName: string
  children: React.ReactNode
  style: React.CSSProperties
  allowed: boolean
}

export const Block: React.FC<Props> = ({ children, blockName, style, allowed }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className='block' style={style}>
      <div style={blockName !== "Assistant" ? { display: 'inline' } : {
        display: 'grid',
        gridTemplateColumns: 'min-content min-content min-content',
        width: '95%',
        margin: '0 auto'
      }}>
        {blockName !== "" ?
          <>
            <Title order={3}>{blockName}</Title>
            {
              blockName === "Assistant" ?
                <>
                  <Modal opened={opened} onClose={close} centered title="Add OpenAI API Key">
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto auto',
                      padding: '1em',
                      width: '95%',
                      margin: '0 auto'
                    }}>
                      <Text>Enter API key below</Text>
                      <Badge onClick={() => window.open("https://platform.openai.com/account/api-keys")} color="grape" variant="outline" style={{ marginLeft: '1em', transform: 'translateY(30%)' }}>
                        Where to find it?
                      </Badge>
                    </div>
                    <Text>The API key will be encrypted and stored within local storage</Text>
                    <Input placeholder="API Key" onKeyDown={(evnt: any) => {
                      if (evnt.keyCode == 13) {
                        //store api key in localstorage
                        fetch('http://localhost:8080/key', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            key: evnt.target.value
                          }),
                        }).then((res) => {
                          localStorage.setItem("key", "1");
                          console.log(res)
                          close()
                        })
                      }
                    }}></Input>
                  </Modal>
                  <Badge color="green" variant="outline" style={{
                    marginLeft: '1em',
                    transform: 'translateY(30%)'
                  }}
                    title="GPT-3 is a large language model developed by OpenAI that uses deep learning algorithms to generate human-like text and perform various natural language processing tasks."
                  >GPT-3
                  </Badge>
                  <Badge color="grape" variant="outline" onClick={open} style={{ marginLeft: '1em', transform: 'translateY(30%)' }}>Allow Access</Badge>
                </> : <></>
            }
          </> :
          <></>}
      </div>
      <hr></hr>
      {children}
    </div>
  )
}
