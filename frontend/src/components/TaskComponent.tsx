import React, {useContext, useState} from 'react'
import { Inbox } from './Inbox'
import { DocEditor }  from './Editor'
import {Link, useParams} from 'react-router-dom'
import { CaptureBlock } from './CaptureBlock'
import {GlobalState} from "../GTWContext";
import {Document, TaskType} from "../types/types"
import {Dashboard} from "./Dashboard";
import { useLocation } from 'react-router-dom'
import {Block} from "./Block";
import { Priority } from '../types/types'
import { GTW } from '../LocalStorage'

export const TaskComponent: React.FC = () => {
    let {id} = useParams();
    const {updateTask} = GTW();
    const [state, setState] = useContext(GlobalState);
    const taskState = useLocation().state;
    const docIndex = taskState.docIndex
    const task: TaskType = taskState.task;


    const [isDashboard, onDashboard] = useState<boolean>(true)
    const [saved, setSaved] = useState<boolean>(false);
    const [doc, setDoc] = useState<Document>(state[parseInt(id!,10)])

    const [dueDate, setDueDate] = useState<string>(task.dueDate)
    const [priority, setPriority] = useState<number>(task.priority)
    const [description, setDesc] = useState<string>(task.description)
    const [dependentOn, setDependentOn] = useState<TaskType>(task.dependentOn)

    return (
        <div style={{"display": "flex"}}>
            <div style={{"width": "50%"}}>
                <div className='header'>
                    <div style={{display: 'flex', gap: '2em'}}>
                        <Link to={`/docs/${docIndex}`}><span>Dashboard</span></Link>
                        <Link to={`/docs/${docIndex}`}><span>Inbox ({state[id!]._inbox.length})</span></Link>
                    </div>
                </div>
                <div>                
                    <span>Due Date</span>
                    <input type="date" value={dueDate} min={new Date().toISOString().substring(0,10)} onChange={(event) => setDueDate(event.target.value)}></input>
                    <button type="submit" onClick={() => updateTask(docIndex, parseInt(id,10), {description,  dueDate: dueDate, priority, dependentOn})}>Update Due Date</button>
                </div>
                <div>                
                    <span>Priority</span>
                    <select onChange={(event) => setPriority(parseInt(event.target.value,10))} required>
                        <option value={Priority.High} selected={true}>High</option>
                        <option value={Priority.Mid}>Mid</option>
                        <option value={Priority.Low}>Low</option>
                    </select>                
                    <button type="submit" onClick={() => updateTask(docIndex, parseInt(id,10), {description,  dueDate, priority: priority, dependentOn})}>Update Priority</button>
                </div>
                <div>                
                    <span>Due Date</span>
                    <input type="date" value={task.dueDate}></input>
                </div>
                <h1>{task.description}</h1>
                <Block docIndex={docIndex} blockName={"Reference Material"}>
                    <h1>ffffff</h1>
                </Block>
                <Block docIndex={docIndex} blockName={"Got Writers Block?"}>
                    <h1>asdsadsd</h1>
                </Block>
            </div>
            <div style={{"width": "50%"}}>
                <div className='header'>
                    {doc.doc_name}
                </div>
                <DocEditor content={doc.content} docIndex={parseInt(id!, 10)}/>
            </div>
        </div>
    )
}
