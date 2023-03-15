import React, { useContext, useEffect, useState } from "react"
import '../styles/CaptureBlock.css'
import { Status, TaskType } from "../types/types"
import { Priority } from "../types/types"
import { GlobalState } from "../GTWContext";
import { Document } from "../types/types"
import { Link } from "react-router-dom";
import { GTW } from "../LocalStorage";
import { Button, Input, Textarea } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { DatePickerInput } from '@mantine/dates';

interface Props {
  docIndex: number;
}

export const CaptureBlock: React.FC<Props> = ({ docIndex }) => {
  const { state, setState } = useContext(GlobalState)
  const { getGTW, addTask, getTask, getDoc, getTaskIndex } = GTW();

  const [currentInbox, setCurrentInbox] = useState<TaskType[]>(() => {
    const docs: Document[] = state
    console.log(docs[docIndex]._inbox)
    return docs[docIndex]._inbox
  })

  const [dueDate, setDueDate] = useState<Date | null>(null)
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
          getDoc(docIndex)._inbox[getDoc(docIndex)._inbox.length - 1].taskID + 1
          :
          0,
      description: desc,
      dependentOn: dependentOn,
      referenceMaterial: {
        notes: "",
        links: [],
        media: []
      },
      priority: priority,
      dueDate: new Date(dueDate).toISOString().slice(0, 10),
      status: Status.Todo
    }
    let prev = [...currentInbox];

    setCurrentInbox([...prev!, task]);
    addTask(docIndex, task)
    setState(getGTW())

    setDesc("")
    setPriority(0)
    setDueDate(null)
    setDependentOn(null)
  }

  const dependentOnInput = (event) => {
    //get task from storage
    const taskID: number = parseInt(event.target.value, 10)
    const taskIndex = getTaskIndex(docIndex, taskID)
    console.log("taskId: " + taskIndex)
    const task: TaskType = getTask(taskIndex, docIndex)
    setDependentOn(task)
  }

  return (
    <>
      <Textarea
        placeholder="Your comment"
        value={desc}
        onChange={(event: any) => setDesc(event.target.value)}
        className='capture-textarea'
      />
      {/* <textarea value={desc} onChange={(event) => setDesc(event.target.value)} className={'capture-textarea'} required></textarea> */}
      <div className='captureBlock' style={{ display: 'grid', gridTemplateColumns: '25% 25% 25% 25%' }}>
        <div style={{ display: 'inherit' }}>
          <span>Due Date</span>
          <DatePickerInput
      label="Pick date"
      placeholder="Pick date"
      value={new Date(dueDate)}
      onChange={setDueDate} 
      required
      mx="auto"
      maw={400}
    />
          {/* <input className={'myDropDown'} type="date" min={new Date().toISOString().substring(0, 10)} value={dueDate} onChange={(event) => setDueDate(event.target.value)} required /> */}
        </div>
        <div style={{ display: 'inherit' }}>
          <span>Priority</span>
          <Input component="select" rightSection={<IconChevronDown size={14} stroke={1.5} />}
            className={'myDropDown'} onChange={(event) => setPriority(parseInt(event.target.value, 10))} required>
            <option value={Priority.High} selected={true}>High</option>
            <option value={Priority.Mid}>Mid</option>
            <option value={Priority.Low}>Low</option>
          </Input>
        </div>
        <div style={{ display: 'inherit' }}>
          <span>Dependent on</span>
          {
            currentInbox.length !== 0 ?
            <Input component="select" rightSection={<IconChevronDown size={14} stroke={1.5} />}
              className={'myDropDown'} onChange={dependentOnInput}>
                <option value={-1} selected={true}>None</option>
                {
                  currentInbox.filter((task: TaskType) => task.status != Status.Done).map((item: TaskType) => {
                    return <option value={item.taskID}>{item.description}</option>
                  })
                }
              </Input> :
              <Input className={'myDropDown'} disabled />
          }
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'center'
        }}>
          <Button
            color="gray"
            onClick={handleTask}
            className='captureButton'>
            Capture
          </Button>
        </div>
      </div>
    </>
  )

}