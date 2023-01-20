import * as types from './types/types'
import {Document, TaskType} from "./types/types";
import {LexicalEditor} from "lexical";

export const GTW: string = 'gtw'

export function getGTW(): Document[]{
    return JSON.parse(localStorage.getItem(GTW))
}

export function setGTW(docs: Document[]){
    localStorage.setItem(GTW, JSON.stringify(docs))
}
export function addTask(docIndex: number, task: types.TaskType) {
    const docs: Document[] = getGTW()
    docs[docIndex]._inbox.push(task)
    localStorage.setItem(GTW, JSON.stringify(docs))
}

export function removeTask(docIndex: number, taskIndex: number){
    const docs: Document[] = getGTW()
    docs[docIndex]._inbox.splice(taskIndex, 1)
    localStorage.setItem(GTW, JSON.stringify(docs))
}

export function getTask(id: number, docIndex: number){
    const docs: Document[] = getGTW()
    const task: TaskType = docs[docIndex]._inbox[id]
    return task;
}

export function addDoc(doc: types.Document){
    const docs: Document[] = getGTW()
    docs.push(doc);
    localStorage.setItem(GTW, JSON.stringify(docs))
}

export function removeDoc(docIndex: number){
    const docs: Document[] = getGTW()
    docs.splice(docIndex, 1);
    localStorage.setItem(GTW, JSON.stringify(docs))
}

