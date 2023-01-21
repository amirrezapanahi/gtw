import React, {useContext, useEffect, useState} from "react"
import {TaskType} from "../types/types"
import { Priority } from "../types/types"
import {useGlobalState} from "../GTWContext";
import {Document} from "../types/types"
import {Link} from "react-router-dom";
import {addTask, getGTW, getTask} from "../LocalStorage";

interface Props {
  docIndex: number;
}

export const CaptureBlock: React.FC<Props> = ({docIndex}) => {
    const {state, setState} = useGlobalState()

    const [currentInbox, setCurrentInbox] = useState<TaskType[]>(() => {
        const docs: Document[] = getGTW()
        console.log(docs[docIndex]._inbox)
        return docs[docIndex]._inbox
    })
    const [dueDate, setDueDate] = useState<string>("")
    const [priority, setPriority] = useState<number>(0)
    const [desc, setDesc] = useState<string>("")
    const [dependentOn, setDependentOn] = useState<TaskType>(null)
    const handleTask = () => {
        //get inbox property for particular doc
        const docs: Document[] = state
        const task: TaskType = {
            description: desc,
            dependentOn: dependentOn,
            priority: priority,
            dueDate: new Date(dueDate).toISOString().slice(0,10),
        }

        docs[docIndex]._inbox.push(task)
        let prev = [...currentInbox];
        setCurrentInbox([...prev!, task]);
        addTask(docIndex,task)
        setState(docs)
    }

    return(
    <div className='block'>
      <h3> Capture </h3>
      <hr></hr>
      <textarea value={desc} onChange={(event) => setDesc(event.target.value)} required></textarea>
      <div style={{display: 'flex'}}>
        <span>Due Date</span>
        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required/>
        <span>Priority</span>
        <select onChange={(event) => setPriority(parseInt(event.target.value,10))} required>
            <option value={Priority.High} selected={true}>High</option>
            <option value={Priority.Mid}>Mid</option>
            <option value={Priority.Low}>Low</option>
        </select>
        <span>Dependent on</span>
          {
              currentInbox.length !== 0 ?
                  <select onChange={(event) => {
                      //get task from storage
                      const taskId: number = parseInt(event.target.value,10)
                      const task: TaskType = getTask(taskId, docIndex)
                      setDependentOn(task)
                  }
                  }>
                      <option value={-1} selected={true}>None</option>
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