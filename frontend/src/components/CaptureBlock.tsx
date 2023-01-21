import React, {useContext, useEffect, useState} from "react"
import {TaskType} from "../types/types"
import { Priority } from "../types/types"
import {useGlobalState} from "../GTWContext";
import Document from "../types/doc";
import {Link} from "react-router-dom";

interface Props {
  docIndex: number;
}

export const CaptureBlock: React.FC<Props> = ({docIndex}) => {
    const {state, setState} = useGlobalState()

    const [currentInbox, setCurrentInbox] = useState<TaskType[]>(() => {
        const docs: Document[] = JSON.parse(localStorage.getItem('gtw'))
        console.log(docs[docIndex]._inbox)
        return docs[docIndex]._inbox
    })
    const [dueDate, setDueDate] = useState<string>("")
    const [priority, setPriority] = useState<string>("")
    const [desc, setDesc] = useState<string>("")
    const [dependentOn, setDependentOn] = useState<TaskType>(null)
    const handleTask = () => {
        //get inbox property for particular doc
        // const docs: Document[] = JSON.parse(localStorage.getItem('gtw'))
        const docs: Document[] = state
        const task: TaskType = {
            description: desc,
            dependentOn: dependentOn,
            priority: Priority[priority],
            dueDate: new Date(dueDate).toISOString().slice(0,10),
        }

        docs[docIndex]._inbox.push(task)
        let prev = [...currentInbox];
        setCurrentInbox([...prev!, task]);
        localStorage.setItem('gtw', JSON.stringify(docs))
        // @ts-ignore
        setState(docs, () => {
            console.log(state)
        })
    }

    return(
    <div className='block'>
      <h3> Capture </h3>
      <hr></hr>
      <textarea value={desc} onChange={(event) => setDesc(event.target.value)} ></textarea>
      <div style={{display: 'flex'}}>
        <span>Due Date</span>
        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        <span>Priority</span>
        <select >
            <option value={Priority.High}>High</option>
            <option value={Priority.Mid}>Mid</option>
            <option value={Priority.Low}>Low</option>
        </select>
        <span>Dependent on</span>
          {
              currentInbox.length !== 0 ?
                  <select>
                      {
                          currentInbox.map((item:TaskType, i:number) =>{
                              return <option value={i}>{item.description}</option>
                          })
                      }
                  </select> :
                  <select disabled><option>Inbox empty</option></select>
          }
          <button type="submit" onClick={handleTask}>Capture</button>
      </div>
    </div>
  )
  
}