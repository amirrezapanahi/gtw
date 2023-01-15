import React, { Dispatch, SetStateAction, useState, ReactPropTypes } from 'react'
import RichTextEditor, {EditorValue} from 'react-rte';

interface Props {
    getContent: (content:string) => void
    doneClicked: (content:string) => void
    readOnly: boolean
}

export const TextBox: React.FC<Props> = ({getContent, doneClicked, readOnly}) => {

    const [content, setContent] = useState<EditorValue>(RichTextEditor.createEmptyValue())

    const handleUserInput = (value: EditorValue) => {
        setContent(value)
        getContent(value.toString("html"))
    }

    const buttonClicked = () => {
        var contentBeforeReset = content;
        setContent(EditorValue.createEmpty);
        doneClicked(contentBeforeReset.toString("html"));
    }

    // onChange = (value: EditorValue) => {
    //     setContent(value);
    //     if (this.props.onChange) {
    //       // Send the changes up to the parent component as an HTML string.
    //       // This is here to demonstrate using `.toString()` but in a real app it
    //       // would be better to avoid generating a string on each change.
    //       this.props.onChange(
    //         value.toString('html')
    //       );
    //     }
    //   };
  
    return (
        <>
        {/* <RichTextEditor value={content} onChange={(value:EditorValue) => handleUserInput(value)}
        /> */}
        <RichTextEditor
            value={content}
            onChange={(value:EditorValue) => handleUserInput(value)}
            placeholder="Begin writing ... "
            readOnly={readOnly}
          />
        {/* <textarea onChange={e => handleUserInput(e)} placeholder="Begin writing..." value={content}></textarea> */}
        <button onClick={buttonClicked} className="button">Save</button>
        </>
    )
}
