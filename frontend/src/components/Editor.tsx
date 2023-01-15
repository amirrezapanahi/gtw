import React, { useEffect, useState, useCallback, useMemo,Ref, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import Editor from './editor/Editor';

interface Props {
  content: string //html
  docIndex: number
}

export const DocEditor: React.FC<Props> = ({content, docIndex}) => {


  const[newContent, setNewContent] = useState("")

  const saveContent = () => {
    //update local storage with new content     
    let docs = JSON.parse(localStorage.getItem('gtw')!)
    localStorage.setItem('gtw', JSON.stringify(docs)) 
  }

  const updateContent = (value: any) => {
    console.log(value.toString('html'))
    setNewContent(value)
  }

  return (
    <div style={{"backgroundColor": "white", "height": "100vh"}}>
        <Editor docIndex={docIndex}/>
    </div>
  )
}