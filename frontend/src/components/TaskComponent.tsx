import React, {useState} from 'react'
import { Inbox } from './Inbox'
import { DocEditor }  from './Editor'
import {Link, useParams} from 'react-router-dom'
import { CaptureBlock } from './CaptureBlock'
import {useGlobalState} from "../GTWContext";
import {Document} from "../types/types"
import {Dashboard} from "./Dashboard";

export const TaskComponent: React.FC = () => {
    const {state, setState} = useGlobalState()

    return (
        <></>
    )
}
