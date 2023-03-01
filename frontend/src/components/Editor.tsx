import React, { useEffect, useState, useCallback, useMemo,Ref, PropsWithChildren } from 'react'
import Editor from './editor/Editor';

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