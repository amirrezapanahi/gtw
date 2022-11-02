import React, { Dispatch, SetStateAction, useState } from 'react'

interface Props {
    getContent: (content:string) => void
    doneClicked: (content:string) => void
}

export const TextBox: React.FC<Props> = ({getContent, doneClicked}) => {

    const [content, setContent] = useState<string>("")


    const handleUserInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value)
        getContent(e.target.value) 
    }

    const buttonClicked = () => {
        var contentBeforeReset = content;
        setContent("");
        doneClicked(contentBeforeReset);
    }
  
    return (
        <>
        <textarea onChange={e => handleUserInput(e)} placeholder="Begin writing..." value={content}></textarea>
        <button onClick={buttonClicked} className="button">Done</button>
        </>
    )
}
