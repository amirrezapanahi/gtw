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
  editorEmpty: boolean
  allowed: boolean
}

export const Assistant: React.FC<Props> = ({ docIndex, response, isLoading, editorEmpty, allowed }) => {
  const { getGTW, setGTW } = GTW()
  const { state, setState } = useContext(GlobalState)
  const [aiOption, setAIOption] = useState(1)
  const [promptData, setPromptData] = useState("")
  const [aiRes, setAIRes] = useState(response)
  const [loading, setLoading] = useState(isLoading)

  useEffect(()=>{
    setPromptData("")
  },[aiOption])

  useEffect(() => {
    if (isLoading) { //review tool
      const splitData = response.split('@')
      let output = splitData[0]      
      console.log("Assistant.tsx: " + output)
      setAIRes(output)
    } else {
      console.log("Assistant: " + response)
      setAIRes(response)
    }
  }, [response])

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading])

  useEffect(() => {
    console.log('is loading: ' + loading)
    if (!loading || isLoading) {
      return
    }

    if (aiOption == 1) {
      console.log("custom prompt entered")
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
      console.log("structure prompt entered")
      if (!editorEmpty) {
        setAIRes("Document is not an empty slate")
        setLoading(false)
        return
      }

      fetch('http://localhost:8080/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: promptData
        }),
      }).then((res) => res.json()).then((data) => {

        const splitData = data.aiResponse.split('@')
        const html = splitData[0]
        let output = splitData[1]

        const json = generateJSON(html, [
          StarterKit,
          Underline,
          Link,
          Superscript,
          SubScript,
          Highlight,
          TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ]);

        console.log(html)
        state[docIndex].content.all = JSON.stringify(json)
        setAIRes(output)

      })
    }
  }, [loading])

  useEffect(() => {
    console.log("new content: " + state[docIndex].content)
    setGTW(state)
    setState(getGTW())
  }, [aiRes])

  useEffect(() => {
    setLoading(false)
  }, [state])


  const handlePromptSubmit = (event: any) => {
    if (event.key === 'Enter') {
      setLoading(true)
    }
  }

  return (
    <div style={{ width: '95%', margin: '0 auto' }}>
      <Input disabled={!allowed} component="select" rightSection={<IconChevronDown size={14} stroke={1.5} />} onChange={(e: any) => setAIOption(e.target.value)}>
        <option value="1">Ideation</option>
        <option value="2">Report Structure</option>
        <option value="3">Review Tool</option>
      </Input>
      <Textarea disabled={aiOption == 3 || !allowed}
        placeholder={
          aiOption == 1 ? "Write custom prompt here" : (aiOption == 2 ? "Topic" : "To review a piece of text. Highlight the piece of text in the editor and click the 'Review' button \n (Be wary that larger peices of text take longer to review)")
        }
        onChange={(e) => setPromptData(e.target.value)}
        onKeyPress={handlePromptSubmit}
        style={{ width: '100%' }}
      />
      <Box className="ai" style={{ marginTop: '1em', flexGrow: '1', 'height': '25vh' }} pos='relative'>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        <Textarea readOnly={true} value={aiRes} variant="filled" style={{ width: '100%', height: '100%' }} />
      </Box>

    </div>
  )
}