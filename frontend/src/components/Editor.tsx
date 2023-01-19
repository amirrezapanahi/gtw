import React, { useEffect, useState, useCallback, useMemo,Ref, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import Editor from './editor/Editor';
import {useGlobalState} from "../GTWContext";

interface Props {
  content: string //html
  docIndex: number
}

export const DocEditor: React.FC<Props> = ({content, docIndex}) => {

  const[newContent, setNewContent] = useState("")

  return (
    <div style={{"backgroundColor": "white", "height": "100vh"}}>
        <Editor docIndex={docIndex}/>
    </div>
  )
}