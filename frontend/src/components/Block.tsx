import React, { useEffect } from "react"
import { TaskType } from "../types/types"
import { Priority } from "../types/types"

interface Props {
  docIndex: number;
}

export const CaptureBlock: React.FC<Props> = ({docIndex}) => {

  return(
    <div className='block'>
      <h3> Capture </h3>
      <hr></hr>
      <textarea>
        
      </textarea>
      <div style={{display: 'flex'}}>
        <span>Due Date</span>
        <input type="date" />        
        <span>Priority</span>
        <select name="cars" id="cars">
          <option value={Priority.High}>High</option>
          <option value={Priority.Mid}>Mid</option>
          <option value={Priority.Low}>Low</option>
        </select>
        <span>Dependent on</span>
        <select name="cars" id="cars">
          <option value="Project 1">Volvo</option>
          <option value="Project 2">Saab</option>
          <option value="Project 3">Opel</option>
        </select>
        
      </div>
    </div>
  )
  
}