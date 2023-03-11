import React, { useContext, useEffect, useState } from "react"
import '../styles/CaptureBlock.css'
import { TaskType } from "../types/types"
import { Priority } from "../types/types"
import { GlobalState } from "../GTWContext";
import { Document } from "../types/types"
import { Link } from "react-router-dom";
import { GTW } from "../LocalStorage";

interface Props {
  docIndex: number;
}

export const CaptureBlock: React.FC<Props> = ({ docIndex }) => {
  const {state, setState} = useContext(GlobalState)
  const { getGTW, addTask, getTask, getDoc, getTaskIndex } = GTW();

  const [currentInbox, setCurrentInbox] = useState<TaskType[]>(() => {
    const docs: Document[] = state
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
      projectID: docIndex,
      taskID:
      getDoc(docIndex)._inbox.length != 0 
       ? 
      getDoc(docIndex)._inbox[getDoc(docIndex)._inbox.length-1].taskID + 1
       :
      0,
      description: desc,
      dependentOn: dependentOn,
      priority: priority,
      dueDate: new Date(dueDate).toISOString().slice(0, 10),
      completed: false,
    }
    let prev = [...currentInbox];

    setCurrentInbox([...prev!, task]);
    addTask(docIndex, task)
    setState(getGTW())

    setDesc("")
    setPriority(0)
    setDueDate("")
    setDependentOn(null)
  }

  return (
    <>
      <textarea value={desc} onChange={(event) => setDesc(event.target.value)} className={'capture-textarea'} required></textarea>
      <div style={{ display: 'grid', gridTemplateColumns: '25% 25% 25% 25%' }}>
        <div style={{ display: 'inherit'}}>
          <span>Due Date</span>
          <input className={'myDropDown'} type="date" min={new Date().toISOString().substring(0, 10)} value={dueDate} onChange={(event) => setDueDate(event.target.value)} required />
        </div>
        <div style={{display: 'inherit'}}>
          <span>Priority</span>
          <select className={'myDropDown'} onChange={(event) => setPriority(parseInt(event.target.value, 10))} required>
            <option value={Priority.High} selected={true}>High</option>
            <option value={Priority.Mid}>Mid</option>
            <option value={Priority.Low}>Low</option>
          </select>
        </div>
        <div style={{display: 'inherit'}}>
          <span>Dependent on</span>
          {
            currentInbox.length !== 0 ?
              <select className={'myDropDown'} onChange={(event) => {
                //get task from storage
                const taskID: number = parseInt(event.target.value, 10)
                const taskIndex = getTaskIndex(docIndex, taskID)
                console.log("taskId: " + taskIndex)
                const task: TaskType = getTask(taskIndex, docIndex)
                setDependentOn(task)
              }
              }>
                <option value={-1} selected={true}>None</option>
                {
                  currentInbox.filter((task:TaskType)=>task.completed == false).map((item: TaskType) => {
                    return <option value={item.taskID}>{item.description}</option>
                  })
                }
              </select> :
              <select className={'myDropDown'} disabled><option>Inbox empty</option></select>
          }
        </div>
        <button type="submit" onClick={handleTask}>Capture</button>
      </div>
    </>
  )

}