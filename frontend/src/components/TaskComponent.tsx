import React, {useState} from 'react'
import { Inbox } from './Inbox'
import { DocEditor }  from './Editor'
import {Link, useParams} from 'react-router-dom'
import { CaptureBlock } from './CaptureBlock'
import {useGlobalState} from "../GTWContext";
import {Document, TaskType} from "../types/types"
import {Dashboard} from "./Dashboard";
import { useLocation } from 'react-router-dom'
import {Block} from "./Block";

export const TaskComponent: React.FC = () => {
    let {id} = useParams();
    const {state, setState} = useGlobalState()
    const taskState = useLocation().state;
    const docIndex = taskState.docIndex
    const task: TaskType = taskState.task;


    const [isDashboard, onDashboard] = useState<boolean>(true)
    const [saved, setSaved] = useState<boolean>(false);
    const [doc, setDoc] = useState<Document>(state[parseInt(id!,10)])

    return (
        <div style={{"display": "flex"}}>
            <div style={{"width": "50%"}}>
                <div className='header'>
                    <div style={{display: 'flex', gap: '2em'}}>
                        <Link to={`/docs/${docIndex}`}><span>Dashboard</span></Link>
                        <Link to={`/docs/${docIndex}`}><span>Inbox ({state[id!]._inbox.length})</span></Link>
                    </div>
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
