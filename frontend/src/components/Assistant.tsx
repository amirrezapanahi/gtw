import { Box, Button, Group, Input, LoadingOverlay, Textarea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconChevronDown } from '@tabler/icons-react'
import React, { useContext, useEffect, useState } from 'react'
import { GlobalState } from '../GTWContext'
import { GTW } from '../LocalStorage'
import { Node, DOMParser } from 'prosemirror-model';
import { EditorState } from '@tiptap/pm/state'
import { generateJSON } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import SubScript from '@tiptap/extension-subscript';

interface Props {
  docIndex: number
  response: string
  isLoading: boolean
}

export const Assistant: React.FC<Props> = ({ docIndex, response, isLoading }) => {
  const { getGTW, setGTW } = GTW()
  const { state, setState } = useContext(GlobalState)
  const [aiOption, setAIOption] = useState(1)
  const [promptData, setPromptData] = useState("")
  const [aiRes, setAIRes] = useState(response)
  const [loading, setLoading] = useState(isLoading)

  useEffect(() => {
    console.log("Assistant: " + response)
    setAIRes(response)
  }, [response])

  useEffect(() => {
    if (aiOption == 1) {
      fetch('http://localhost:8080/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptData
        }),
      }).then((res) => res.json()).then((data) => {
        setAIRes(data.aiResponse)
        setLoading(false)
      })
    } else if (aiOption == 2) {
      fetch('http://localhost:8080/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: promptData
        }),
      }).then((res) => res.json()).then((data) => {
        const splitData = data.split('@')
        const html = splitData[0]
        const output = splitData[1]

        const json = generateJSON(html, [
          StarterKit,
          Underline,
          Link,
          Superscript,
          SubScript,
          Highlight,
          TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ]);

        if (state[docIndex].content == "") {
          //serialize html to json
          state[docIndex].content = JSON.stringify(json)
          setGTW(state)
          setState(getGTW())
        }

        setAIRes(output)
        setLoading(false)
      })
    }
  }, [loading])


  const handlePromptSubmit = (event: any) => {
    if (event.key === 'Enter') {
      setLoading(true)
    }
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
        style={{ width: '100%' }}
      />
      <Box className="ai" style={{ marginTop: '1em', flexGrow: '1', 'height': '30vh' }} pos='relative'>
        <LoadingOverlay visible={isLoading} overlayBlur={2} />
        <Textarea readOnly={true} value={aiRes} variant="filled" style={{ width: '100%', height: '100%' }} />
      </Box>

    </div>
  )
}