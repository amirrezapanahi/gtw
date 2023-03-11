import React, { useContext, useEffect, useState } from 'react'
import '../styles/TaskComponent.css'
import { DocEditor } from './Editor'
import { Link, useParams } from 'react-router-dom'
import { GlobalState } from "../GTWContext";
import { Document, TaskType } from "../types/types"
import { useLocation } from 'react-router-dom'
import { Block } from "./Block";
import { Priority } from '../types/types'
import { GTW } from '../LocalStorage'

export const TaskComponent: React.FC = () => {
  let { id } = useParams();
  const { getGTW, updateTask, getTaskIndex, removeTask, completeTask } = GTW();
  const { state, setState } = useContext(GlobalState);
  const taskState = useLocation().state;
  const docIndex = taskState.docIndex
  const task: TaskType = state[taskState.docIndex]._inbox[getTaskIndex(taskState.docIndex, taskState.task.taskID)];

  const [isDashboard, onDashboard] = useState<boolean>(true)
  const [saved, setSaved] = useState<boolean>(false);
  const [doc, setDoc] = useState<Document>(state[parseInt(id!, 10)])

  const [dueDate, setDueDate] = useState<string>(task.dueDate)
  const [priority, setPriority] = useState<number>(task.priority)
  const [description, setDesc] = useState<string>(task.description)
  const [dependentOn, setDependentOn] = useState<TaskType>(task.dependentOn)
  const [completed, setCompleted] = useState<boolean>(task.completed)

  const [seconds, setSeconds] = useState(120)
  const [beginCountdown, setBeginCountdown] = useState(false)

  useEffect(() => {
    let interval = null;

    if (beginCountdown && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [beginCountdown, seconds])

  const formatDuration = (durationInSeconds) =>
    `${Math.floor(durationInSeconds / 60)}:${(durationInSeconds % 60)
      .toString()
      .padStart(2, '0')}`;

  const formattedDuration = formatDuration(seconds);

  return (
    <div style={{ "display": "flex" }}>
      <div style={{ "width": "50%" }}>
        <div className='header'>
          <div style={{ display: 'flex', gap: '2em' }}>
            <Link to={`/docs/${docIndex}`}><span>Dashboard</span></Link>
            <Link to={`/docs/${docIndex}`}><span>Inbox ({state[id!]._inbox.filter((x: TaskType) => x.completed == false).length})</span></Link>
          </div>
        </div>
        <Block docIndex={docIndex} blockName={"Task / Idea"}>
          <div className={"taskInfo"}>
            <div className={"taskInfoContainer"}>
              <h1>{task.description}</h1>
              <div>
                <span>Due Date</span>
                <input type="date" value={dueDate} min={new Date().toISOString().substring(0, 10)} onChange={(event) => setDueDate(event.target.value)}></input>
                <button type="submit" onClick={() => {
                  updateTask(docIndex, task.taskID, {
                    taskID: task.taskID,
                    projectID: task.projectID,
                    description,
                    dueDate: dueDate,
                    priority,
                    dependentOn,
                    completed
                  })
                  setState(getGTW())
                }}>Update Due Date</button>
              </div>
              <div>
                <span>Priority</span>
                <select onChange={(event) => setPriority(parseInt(event.target.value, 10))} required>
                  <option value={Priority.High} selected={task.priority == Priority.High}>High</option>
                  <option value={Priority.Mid} selected={task.priority == Priority.Mid}>Mid</option>
                  <option value={Priority.Low} selected={task.priority == Priority.Low}> Low</option>
                </select>
                <button type="submit" onClick={() => {
                  updateTask(docIndex, task.taskID, {
                    taskID: task.taskID,
                    projectID: task.projectID,
                    description,
                    dueDate,
                    priority: priority,
                    dependentOn,
                    completed
                  })
                  setState(getGTW())
                }}>Update Priority</button>
              </div>
              <div className={"taskOperations"}>
                <Link to={`/docs/${docIndex}`} className={'button'}><button onClick={() => {
                  removeTask(docIndex, task.taskID)
                  setState(getGTW())
                }} title="Delete"><i className="fa-solid fa-trash" style={{ height: '50%' }}></i></button></Link>
                <button onClick={() => {
                  completeTask(docIndex, task.taskID)
                  setState(getGTW())
                }} title="Complete"><i className="fa-solid fa-check" style={{ height: "50%" }}></i></button>
              </div>
            </div>
            <div className={"timer"}>
              <div>
                <span className="time-minutes">{formattedDuration.split(':')[0]}</span>
                <span className="divider">:</span>
                <span className="time-seconds">{formattedDuration.split(':')[1]}</span>
              </div>
              {
                beginCountdown ?
                  <button onClick={() => setBeginCountdown(false)}>Pause Timer</button>
                  :
                  <button onClick={() => setBeginCountdown(true)}>Start Timer</button>
              }
            </div>
          </div>
        </Block>
        <Block docIndex={docIndex} blockName={"Reference Material"}>
          <h1>ffffff</h1>
        </Block>
        <Block docIndex={docIndex} blockName={"Assistant"}>
          <h1>asdsadsd</h1>
        </Block>
      </div>
      <div style={{ "width": "50%" }}>
        <div className='header'>
          {doc.doc_name}
        </div>
        <DocEditor content={doc.content} docIndex={parseInt(id!, 10)} />
      </div>
    </div>
  )
}
