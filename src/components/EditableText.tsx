import { Input } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { GlobalState } from '../GTWContext';
import { GTW } from '../LocalStorage';

interface EditableTextProps {
  docIndex: number
  taskIndex: number
  text: string
  type: string
  setInEditable: React.Dispatch<React.SetStateAction<boolean>> | null
}

export function EditableText({ docIndex, taskIndex, text, type, setInEditable }: EditableTextProps) {
  const { state, setState } = useContext(GlobalState)
  const { setGTW, getGTW } = GTW();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);

  useEffect(() => {
    //set state and localstorage
    if (type == "doc") {
      state[docIndex].doc_name = value
    } else {
      state[docIndex]._inbox[taskIndex].description = value
    }

    setGTW(state)
    setState(getGTW())
  }, [value])

  useEffect(() => {
    if (setInEditable) {
      console.log("inside editable text")
      setInEditable(isEditing)
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  if (isEditing) {
    return (
      <>
        <Input
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      </>
    );
  }

  return (
    <div onDoubleClick={handleDoubleClick}>
      {value}
    </div>
  );
}
