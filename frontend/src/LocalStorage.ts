import * as types from './types/types'
import { Document, TaskType } from "./types/types";
import { GlobalState } from './GTWContext';
import React, { useContext } from 'react';

export const GTW = () => {

  // const [state, setState] = useContext(GlobalState)

  const GTW: string = 'gtw'

  /**
   * retrieves the GTW local storage state
   */
  function getGTW(): Document[] {
    if (!JSON.parse(localStorage.getItem(GTW))) {
      setGTW([])
      return JSON.parse(localStorage.getItem(GTW))
    } else {
      return JSON.parse(localStorage.getItem(GTW))
    }
  }

  function setGTW(docs: Document[]) {
    localStorage.setItem(GTW, JSON.stringify(docs))
    // setState(docs)
  }

  function backupDoc(docIndex: number) {
    const gtwContent = getGTW()[docIndex];
    const fileName = `${gtwContent.doc_name}.gtw`;
    const contentType = "text/plain";
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(gtwContent)], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  function getTaskIndex(docIndex: number, taskID: number): number{
    return getGTW()[docIndex]._inbox.findIndex((element)=> element.taskID == taskID)
  }

  function addTask(docIndex: number, task: types.TaskType) {
    const docs: Document[] = getGTW()
    docs[docIndex]._inbox.push(task)
    setGTW(docs)
  }

  function removeTask(docIndex: number, taskID: number) {
    const docs: Document[] = getGTW()
    docs[docIndex]._inbox.splice(getTaskIndex(docIndex,taskID), 1)
    setGTW(docs)
  }

  function updateTask(docIndex: number, taskID: number, task: TaskType) {
    const docs: Document[] = getGTW()
    // const taskFromStorage = getTask(taskID, docIndex)

    // if (task.dueDate) {
    //   docs[docIndex]._inbox.find(element => element.taskID == taskID).dueDate = task.dueDate
    // }

    // if (task.priority) {
    //   taskFromStorage.priority = task.priority
    // }

    // if (task.dependentOn) {
    //   taskFromStorage.dependentOn = task.dependentOn
    // }

    const taskIndex = getTaskIndex(docIndex, taskID)
    docs[docIndex]._inbox[taskIndex] = task
    setGTW(docs)
  }

  function completeTask(docIndex: number, taskID: number){
    let task: TaskType = getTask(getTaskIndex(docIndex,taskID), docIndex)
    updateTask(docIndex, taskID, {
      taskID: task.taskID,
      projectID: task.projectID,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      dependentOn: task.dependentOn,
      completed: true
    })
  }

  function snoozeTask(docIndex: number, taskID: number){
    let docs: Document[] = getGTW();
    let task: TaskType = getTask(getTaskIndex(docIndex,taskID), docIndex)
    const oneWeekFromNow = new Date(task.dueDate);
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
    docs[docIndex]._inbox[taskID].dueDate = oneWeekFromNow.toISOString().slice(0,10)
    setGTW(docs)
    console.log(getGTW()[docIndex]._inbox[taskID])
  }

  function getTask(id: number, docIndex: number): TaskType {
    const docs: Document[] = getGTW()
    const task: TaskType = docs[docIndex]._inbox[id]
    return task;
  }

  function getDoc(docIndex: number): Document {
    const doc: Document = getGTW()[docIndex]
    return doc;
  }

  function addDoc(doc: types.Document) {
    const docs: Document[] = getGTW()
    docs.push(doc);
    setGTW(docs)
  }

  function removeDoc(docIndex: number) {
    const docs: Document[] = getGTW()
    docs.splice(docIndex, 1);
    setGTW(docs)
  }

  return { getGTW, setGTW, addDoc, removeDoc, getTask, addTask, removeTask, updateTask, getDoc, backupDoc,
          snoozeTask, completeTask}
}

