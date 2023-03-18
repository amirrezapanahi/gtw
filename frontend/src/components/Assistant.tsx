import { Input, Textarea } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import React, { useContext, useEffect, useState } from 'react'
import { GlobalState } from '../GTWContext'
import { GTW } from '../LocalStorage'

interface Props {
  response: string 
}

export const Assistant: React.FC<Props> = ({response}) => {
  const { getGTW } = GTW()
  const { state, setState } = useContext(GlobalState)
  const [aiOption, setAIOption] = useState(1)
  const [promptData, setPromptData] = useState("")
  const [aiRes, setAIRes] = useState(response)
  const [aiAction, toggleAIAction] = useState("")

  useEffect(()=>{
    console.log("Assistant: " + response)
    setAIRes(response)
  },[response])

  useEffect(()=>{
    switch(aiAction){
      case("reset"):
      
      case("populate"):

      default:
        return
    }
  },[aiAction])

  const handlePromptSubmit = (event) => {
    //clear the ai res textarea
    toggleAIAction("reset")

    if (event.key === 'Enter') {
      console.log(promptData)
    }

    //at the end clear prompt data

  }

  return (
    <div style={{ width: '95%', margin: '0 auto' }}>
      <Input component="select" rightSection={<IconChevronDown size={14} stroke={1.5} />} onChange={(e: any) => setAIOption(e.target.value)}>
        <option value="1">Ideation</option>
        <option value="2">Report Structure</option>
        <option value="3">Review Tool</option>
      </Input>
      <Textarea disabled={aiOption == 3}
        placeholder={
          aiOption == 1 ? "Write custom prompt here" : (aiOption == 2 ? "Topic" : "To review a piece of text. Highlight the piece of text in the editor and click the 'Review' button")
        }
        onChange={(e) => setPromptData(e.target.value)}
        onKeyPress={handlePromptSubmit}
        style={{width: '100%'}}
      />
      <div className="ai" style={{marginTop: '1em', flexGrow: '1', 'height': '30vh'}}>
        <Textarea readOnly={true} value={aiRes} variant="filled" style={{width: '100%', height: '100%'}}/>
      </div>
    </div>
  )
}