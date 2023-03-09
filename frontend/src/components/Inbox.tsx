import React, { useContext, useState } from 'react'
import { InboxList } from './InboxList'
import { TaskType } from '../types/types'
import { GlobalState } from "../GTWContext";

interface Props {
  docIndex: number
  condition: (obj: any) => boolean

}
export const Inbox: React.FC<Props> = ({ docIndex, condition }) => {
  const {state, setState} = useContext(GlobalState);
  const [tasks, setTasks] = useState<TaskType[]>(state[docIndex]._inbox)
  const [showResolved, setShowResolved] = useState(false)

  return (
    <table className={'block inbox-list'}>
      <select onChange={(event) => {
        if (event.target.value === "Unresolved") {
          setShowResolved(true)
        } else {
          setShowResolved(false)
        }
      }}>
        <option value="Unresolved" selected={showResolved == false}>Unresolved</option>
        <option value="Resolved" selected={showResolved == true}>Resolved</option>
      </select>
      <InboxList docIndex={docIndex} tasks={tasks} meetsCondition={condition} />
    </table>
  )
}
