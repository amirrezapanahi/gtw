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
import { Badge, Blockquote, Button, Modal, Paper } from '@mantine/core';
import { IconArrowNarrowLeft } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { EditableText } from './EditableText';

export const TaskComponent: React.FC = () => {
  const { getGTW, updateTask, getTaskIndex, removeTask, completeTask, incompleteTask, getDocIndex } = GTW();
  const { state, setState } = useContext(GlobalState);

  const taskState = useLocation().state;
  const task: TaskType = state[getDocIndex(taskState.task.projectID)]._inbox[getTaskIndex(getDocIndex(taskState.task.projectID), taskState.task.taskID)];

  const [doc, setDoc] = useState<Document>(state[getDocIndex(task.projectID)])

  const [dueDate, setDueDate] = useState<string>(task.dueDate)
  const [inEditableText, setInEditableText] = useState(false)
  const [priority, setPriority] = useState<number>(task.priority)
  const [description, setDesc] = useState<string>(task.description)
  const [dependentOn, setDependentOn] = useState<TaskType>(task.dependentOn)
  const [completed, setCompleted] = useState<boolean>(task.status == Status.Done ? true : false)

  const [seconds, setSeconds] = useState(120)
  const [beginCountdown, setBeginCountdown] = useState(false)

  const [editorEmpty, setEditorEmpty] = useState(false)
  const [aiRes, setAIRes] = useState("")
  const [loading, setLoading] = useState(false)
  const [allowed, setAllowed] = useState(() => {
    if (localStorage.getItem("key") && localStorage.getItem("key") == "1") {
      return true;
    } else {
      return false;
    }
  })

  useEffect(() => {
    let interval = null;

    if (beginCountdown && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [beginCountdown, seconds])

  useEffect(() => {
    const currentStatus = task.status
    if (completed) {
      completeTask(getDocIndex(task.projectID), task.taskID)
      setState(getGTW())
    } else if (currentStatus === Status.Done) {
      incompleteTask(getDocIndex(task.projectID), task.taskID)
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
    updateTask(getDocIndex(task.projectID), task.taskID, {
      taskID: task.taskID,
      projectID: task.projectID,
      description,
      dueDate: dueDate,
      priority,
      dependentOn,
      referenceMaterial: task.referenceMaterial,
      status: task.status,
      referenceStart: task.referenceStart,
      referenceEnd: task.referenceEnd,
    })
    setState(getGTW())
  }

  const handlePriority = () => {
    updateTask(getDocIndex(task.projectID), task.taskID, {
      taskID: task.taskID,
      projectID: task.projectID,
      description,
      dueDate,
      priority: priority,
      dependentOn,
      referenceMaterial: task.referenceMaterial,
      status: task.status,
      referenceStart: task.referenceStart,
      referenceEnd: task.referenceEnd,
    })
    setState(getGTW())
  }

  const handleDelete = () => {
    removeTask(getDocIndex(task.projectID), task.taskID)
    setState(getGTW())
  }

  const handleEditorEmpty = (value: boolean) => {
    setEditorEmpty(value)
  }

  const handleAIResponse = (content: string) => {
    setAIRes(content)
  }

  const handleAILoading = (value: boolean) => {
    setLoading(value)
  }

  const formatDuration = (durationInSeconds) =>
    `${Math.floor(durationInSeconds / 60)}:${(durationInSeconds % 60)
      .toString()
      .padStart(2, '0')}`;

  const formattedDuration = formatDuration(seconds);
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div style={{ "display": "flex", overflow: 'hidden' }}>
      <div style={{ "width": "50%", maxHeight: '100vh' }}>
        <div className='header'>
          <Link to={`/`} style={{ justifyContent: 'left' }}><IconArrowNarrowLeft /></Link>
          <div style={{ display: 'flex', gap: '2em' }}>
            <Link to={`/docs/${task.projectID}/dashboard`}><span>Dashboard</span></Link>
            <Link to={`/docs/${task.projectID}/inbox`}><span>Inbox ({state[getDocIndex(task.projectID)]._inbox.filter((x: TaskType) => x.status != Status.Done).length})</span></Link>
          </div>
        </div>
        <Button className='button' style={{ display: 'flex', justifyContent: 'center', width: '95%', margin: '0 auto', marginTop: '1em' }} onClick={open}>
          Task Information
        </Button>
        <Modal size='auto' opened={opened} onClose={close} title="Task Info">
          <div className={"taskInfo"}>
            <div className={"taskInfoContainer"}>
              <Paper withBorder>
                <Blockquote>
                  <EditableText
                    docIndex={getDocIndex(task.projectID)}
                    taskIndex={getTaskIndex(getDocIndex(task.projectID), task.taskID)}
                    text={task.description}
                    setInEditable={setInEditableText}
                    type="task"
                  />
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
                <Link to={`/docs/${task.projectID}/dashboard`} style={{ width: '100%' }}>
                  <Badge color="red" variant="outline" fullWidth onClick={handleDelete} className='taskDelComplete'>
                    Delete
                  </Badge>
                </Link>
                {
                  task.dependentOn != null && task.dependentOn.status != Status.Done ?
                    <Badge title={`task is dependent on ${task.dependentOn.description}`} color="orange" variant="outline" fullWidth className='taskDelDep'>
                      Dependent
                    </Badge>
                    :
                    (
                      completed ?
                        <Badge color="green" variant="outline" fullWidth onClick={handleComplete} className='taskDelComplete'>
                          Completed
                        </Badge>
                        :
                        <Badge color="orange" variant="outline" fullWidth onClick={handleComplete} className='taskDelComplete'>
                          Complete
                        </Badge>
                    )
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
        </Modal>
        <Block docIndex={getDocIndex(task.projectID)} blockName={"Reference Material"} style={{ height: '45vh' }} allowed={null}>
          <ReferenceMaterial docID={getDocIndex(task.projectID)} taskID={getTaskIndex(getDocIndex(task.projectID), task.taskID)} />
        </Block>
        <Block docIndex={getDocIndex(task.projectID)} blockName={"Assistant"} allowed={allowed} style={{
          flexGrow: '1',
          height: '45vh'
        }}>
          <Assistant docIndex={getDocIndex(task.projectID)} response={aiRes} isLoading={loading} editorEmpty={editorEmpty} allowed={allowed} />
        </Block>
      </div>
      <div style={{ "width": "50%", maxHeight: '100vh' }}>
        <div className='header'>
          <EditableText docIndex={getDocIndex(task.projectID)} taskIndex={0} text={doc.doc_name} type={"doc"} setInEditable={setInEditableText} />
        </div>
        <DocEditor
          docIndex={getDocIndex(task.projectID)}
          showReview={true}
          handleResponse={handleAIResponse}
          handleLoading={handleAILoading}
          isEditorEmpty={handleEditorEmpty}
          inEditableText={inEditableText}
          position={{ start: task.referenceStart, end: task.referenceEnd }}
        />
      </div>
    </div>
  )
}
