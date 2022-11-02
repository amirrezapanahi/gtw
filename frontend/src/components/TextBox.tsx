import React, { useState } from 'react'

interface Props {
    getContent: (content:string) => void
}

export const TextBox: React.FC<Props> = ({getContent}) => {

    const [writingContent, setWritingContent] = useState<string>("");
  
    //need to pass the prop back up to the parent so that live preview is updated

    //function which updates the prop 
    const updateContent = (e:any) =>{
        setWritingContent(e.target.value)
        getContent(writingContent);
    }

    const completedContent = () => {

    }
  
    return (
        <>
        <textarea onChange={e => updateContent(e)}></textarea>
        <button onClick={completedContent} className="button">Done</button>
        </>
    )
}
