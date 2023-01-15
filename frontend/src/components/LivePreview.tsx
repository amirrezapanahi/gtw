import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser';

interface Props{
  displayContent: string
  saveContent: boolean
  setWrittenContent: React.Dispatch<React.SetStateAction<string>>
}

export const Editor: React.FC<Props> = ({displayContent, saveContent, setWrittenContent}) => {

  const [content, setContent] = useState<string>("")

  useEffect(() => {
    setContent(content + " " + displayContent);
    setWrittenContent("")
  }, [saveContent])

  return (
    <div style={{"backgroundColor": "white", "height": "100vh"}}>
      {parse(displayContent)}
    </div>
  )
}
