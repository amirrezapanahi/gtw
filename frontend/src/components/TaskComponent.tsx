import React, { useContext, useEffect, useState } from 'react'
import '../styles/TaskComponent.css'
import { DocEditor } from './Editor'
import { Link, useParams } from 'react-router-dom'
import { GlobalState } from "../GTWContext";
import { Document, TaskType, Status } from "../types/types"
import { useLocation } from 'react-router-dom'
import { Block } from "./Block";
import { Priority } from '../types/types'
import { GTW } from '../LocalStorage'
import { ReferenceMaterial } from './ReferenceMaterial'
import { Assistant } from './Assistant'
import { Badge, Blockquote, Button, Paper } from '@mantine/core';
import { IconArrowNarrowLeft } from '@tabler/icons-react';

export const TaskComponent: React.FC = () => {
  const { getGTW, updateTask, getTaskIndex, removeTask, completeTask, incompleteTask } = GTW();
  const { state, setState } = useContext(GlobalState);

  const taskState = useLocation().state;
  const task: TaskType = state[taskState.task.projectID]._inbox[getTaskIndex(taskState.task.projectID, taskState.task.taskID)];

  const [doc, setDoc] = useState<Document>(state[task.projectID])

  const [dueDate, setDueDate] = useState<string>(task.dueDate)
  const [priority, setPriority] = useState<number>(task.priority)
  const [description, setDesc] = useState<string>(task.description)
  const [dependentOn, setDependentOn] = useState<TaskType>(task.dependentOn)
  const [completed, setCompleted] = useState<boolean>(task.status == Status.Done ? true : false)

  const [seconds, setSeconds] = useState(120)
  const [beginCountdown, setBeginCountdown] = useState(false)

  const [aiRes, setAIRes] = useState("")

  useEffect(() => {
    let interval = null;

    if (beginCountdown && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [beginCountdown, seconds])

  useEffect(()=>{
    if(completed) {
      completeTask(task.projectID, task.taskID)
      setState(getGTW())
    }else{
      incompleteTask(task.projectID, task.taskID)
      setState(getGTW())
    }
  }, [completed])

  const handleTimer = () => {
    setBeginCountdown(!beginCountdown)
  }

  const handleComplete = () => {
    setCompleted(!completed)
  }

  const handleDueDate = () => {
    updateTask(task.projectID, task.taskID, {
      taskID: task.taskID,
      projectID: task.projectID,
      description,
      dueDate: dueDate,
      priority,
      dependentOn,
      referenceMaterial: task.referenceMaterial,
      status: task.status
    })
    setState(getGTW())
  }

  const handlePriority = () => {
    updateTask(task.projectID, task.taskID, {
      taskID: task.taskID,
      projectID: task.projectID,
      description,
      dueDate,
      priority: priority,
      dependentOn,
      referenceMaterial: task.referenceMaterial,
      status: task.status
    })
    setState(getGTW())
  }

  const handleDelete = () => {
    removeTask(task.projectID, task.taskID)
    setState(getGTW())
  }

  const handleAIResponse = (content: string) => {
    console.log("Task Component: " + content)
    setAIRes(content)
  }

  const formatDuration = (durationInSeconds) =>
    `${Math.floor(durationInSeconds / 60)}:${(durationInSeconds % 60)
      .toString()
      .padStart(2, '0')}`;

  const formattedDuration = formatDuration(seconds);

  return (
    <div style={{ "display": "flex", overflow: 'hidden' }}>
      <div style={{ "width": "50%", maxHeight: '100vh' }}>
        <div className='header'>
          <Link to={`/`} style={{ justifyContent: 'left' }}><IconArrowNarrowLeft /></Link>
          <div style={{ display: 'flex', gap: '2em' }}>
            <Link to={`/docs/${task.projectID}/dashboard`}><span>Dashboard</span></Link>
            <Link to={`/docs/${task.projectID}/inbox`}><span>Inbox ({state[task.projectID]._inbox.filter((x: TaskType) => x.status != Status.Done).length})</span></Link>
          </div>
        </div>
        <Block docIndex={task.projectID} blockName={""} style={{}}>
          <div className={"taskInfo"}>
            <div className={"taskInfoContainer"}>
              <Paper withBorder>
                <Blockquote>
                  {task.description}
                </Blockquote>
              </Paper>
              <div className='taskInfoUpdate'>
                <span>Due Date</span>
                <input type="date" value={dueDate} min={new Date().toISOString().substring(0, 10)} onChange={(event) => setDueDate(event.target.value)}></input>
                <Button color="dark" onClick={handleDueDate} >
                  Update Due Date
                </Button>
              </div>
              <div className='taskInfoUpdate'>
                <span>Priority</span>
                <select onChange={(event) => setPriority(parseInt(event.target.value, 10))} required>
                  <option value={Priority.High} selected={task.priority == Priority.High}>High</option>
                  <option value={Priority.Mid} selected={task.priority == Priority.Mid}>Mid</option>
                  <option value={Priority.Low} selected={task.priority == Priority.Low}> Low</option>
                </select>
                <Button color="dark" onClick={handlePriority} >
                  Update Priority
                </Button>
              </div>
              <div className={"taskOperations"}>
              <Link to={`/docs/${task.projectID}/dashboard`} style={{width: '100%'}}>
                <Badge color="red" variant="outline" fullWidth onClick={handleDelete} className='taskDelComplete'>
                  Delete
                </Badge>
              </Link>
              {
                completed ?
                <Badge color="green" variant="outline" fullWidth onClick={handleComplete} className='taskDelComplete'>
                Completed
              </Badge>
              :
              <Badge color="orange" variant="outline" fullWidth onClick={handleComplete} className='taskDelComplete'>
              Complete
             </Badge>
              }
              </div>
            </div>
            <div className={"timer"}>
              <div className='clock'>
                <Badge size='xl'>
                <span className="time-minutes">{formattedDuration.split(':')[0]}</span>
                <span className="divider">:</span>
                <span className="time-seconds">{formattedDuration.split(':')[1]}</span>
                </Badge>
              </div>
              {
                beginCountdown ?
                      <Button color="dark" disabled style={{
                        width: '50%',
                        margin: '0 auto',
                      }}>
                      Keep going!
                    </Button>
                  :
                  <Button color="dark" onClick={handleTimer} style={{
                    width: '50%',
                    margin: '0 auto',
                  }}>
                  Start Timer
                </Button>
              }
            </div>
          </div>
        </Block>
        <Block docIndex={task.projectID} blockName={"Reference Material"} style={{}}>
          <ReferenceMaterial docID={task.projectID} taskID={task.taskID} />
        </Block>
        <Block docIndex={task.projectID} blockName={"Assistant"} style={{
          flexGrow: '1'
        }}>
          <Assistant response={aiRes}/>
        </Block>
      </div>
      <div style={{ "width": "50%", maxHeight: '100vh' }}>
        <div className='header'>
          {doc.doc_name}
        </div>
        <DocEditor content={doc.content != "" ? JSON.parse(doc.content) : {}} docIndex={task.projectID} showReview={true} handleResponse={handleAIResponse}/>
      </div>
    </div>
  )
}
