import * as types from './types/types'
import {Document, TaskType} from "./types/types";
import {LexicalEditor} from "lexical";
import { GlobalState } from './GTWContext';
import React, {useContext} from 'react';

export const GTW = () => {

    const [state, setState] = useContext(GlobalState)

    const GTW: string = 'gtw'

    /**
     * retrieves the GTW local storage state
     */
    function getGTW(): Document[]{
        return JSON.parse(localStorage.getItem(GTW))
    }
    
    function setGTW(docs: Document[]){
        localStorage.setItem(GTW, JSON.stringify(docs))
        setState(docs)
    }

    function getState(): any {
        return state;
    }
    
    function addTask(docIndex: number, task: types.TaskType) {
        const docs: Document[] = getGTW()
        docs[docIndex]._inbox.push(task)
        setGTW(docs)
        setState(docs)
    }
    
    function removeTask(docIndex: number, taskIndex: number){
        const docs: Document[] = getGTW()
        docs[docIndex]._inbox.splice(taskIndex, 1)
        setGTW(docs)
        setState(docs)
    }
    
    function updateTask(docIndex: number, taskIndex: number, task: TaskType){
        const docs: Document[] = getGTW()
        const taskFromStorage = getTask(docIndex, taskIndex)
        
        if (task.dueDate){
            taskFromStorage.dueDate = task.dueDate
        }
    
        if (task.priority){
            taskFromStorage.priority = task.priority
        }
    
        if (task.dependentOn){
            taskFromStorage.dependentOn = task.dependentOn
        }
    
        setGTW(docs)
        setState(docs)
    }
    
    function getTask(id: number, docIndex: number){
        const docs: Document[] = getGTW()
        const task: TaskType = docs[docIndex]._inbox[id]
        return task;
    }
    
    function addDoc(doc: types.Document){
        const docs: Document[] = getGTW()
        docs.push(doc);
        setGTW(docs)
        setState(docs)
    }
    
    function removeDoc(docIndex: number){
        const docs: Document[] = getGTW()
        docs.splice(docIndex, 1);
        setGTW(docs)
        setState(docs)
    }

    return {getGTW, setGTW, addDoc, removeDoc, getTask, addTask, removeTask, updateTask}
}

