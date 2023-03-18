import React, { useContext, useState } from "react";
import { CaptureBlock } from "./CaptureBlock";
import { Block } from "./Block";
import { GlobalState } from "../GTWContext";
import { Status, TaskType } from "../types/types";
import { InboxList } from "./InboxList";
import { Board } from './kanban/Board'
import { Card } from './kanban/Card'
import { Paper, Text, Badge } from "@mantine/core";
import { Link } from "react-router-dom";
import { GTW } from "../LocalStorage";
import { overflow } from "html2canvas/dist/types/css/property-descriptors/overflow";

interface Props {
  docIndex: number
}

export const Dashboard: React.FC<Props> = ({ docIndex }) => {
  const { state } = useContext(GlobalState)
  const { getTaskIndex } = GTW()
  const [tasks] = useState<TaskType[]>(state[docIndex]._inbox)

  const currentDate = new Date();
  const currentWeek = currentDate.getDay() <= 3 ? currentDate.getDay() + 4 : currentDate.getDay() - 3;

  const isDueThisWeek = (dueDate: Date) => {
    return dueDate >= currentDate && dueDate <= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentWeek))
  }
  const isOverdue = (task: TaskType) => {
    const currentDate = new Date()
    const currentDateMs = currentDate.getTime()
    const dueDate = new Date(task.dueDate).getTime()
    return task.status != Status.Done && (dueDate - currentDateMs) <= 0
  }

  return (
    <div className={'dashboard'}>
      <Block docIndex={docIndex} blockName={"Capture"} style={{ height: '25vh' }}>
        <CaptureBlock docIndex={docIndex} />
      </Block>
      <Block docIndex={docIndex} blockName={"Overdue"} style={{ height: '20vh' }}>
        <InboxList docIndex={docIndex} tasks={tasks} meetsCondition={isOverdue} showResolved={false} />
      </Block>
      <Block docIndex={docIndex} blockName={"Due Soon"} style={{ height: '50vh' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '1em', gap: '1em', overflow: 'auto' }}>
          <div>
            <Badge color="blue" className='kanbanHeader'>To Do</Badge>
            <Board docIndex={docIndex} id='todoBoard' className='board'>
              {
                state[docIndex]._inbox.filter((task: TaskType) =>
                  task.status == Status.Todo && isDueThisWeek(new Date(task.dueDate))).map((task) => {
                    return (
                      <Card docIndex={docIndex} id={task.taskID.toString()} className="card">
                        <Link to={`/docs/${docIndex}/task/${getTaskIndex(docIndex, task.taskID)}`} state={{ docIndex: docIndex, task: task }}>
                          <Paper shadow="xs" p="md" withBorder>
                            <Text>{task.description}</Text>
                          </Paper>
                        </Link>
                      </Card>
                    )
                  })
              }
            </Board>
          </div>
          <div>
            <Badge color="orange" className='kanbanHeader'>Doing</Badge>
            <Board docIndex={docIndex} id='doingBoard' className='board'>
              {
                state[docIndex]._inbox.filter((task: TaskType) =>
                  (task.status == Status.Doing) && isDueThisWeek(new Date(task.dueDate))
                ).map((task) => {
                  return (
                    <Card docIndex={docIndex} id={task.taskID.toString()} className="card">
                      <Link to={`/docs/${docIndex}/task/${getTaskIndex(docIndex, task.taskID)}`} state={{ docIndex: docIndex, task: task }}>
                        <Paper shadow="xs" p="md" withBorder>
                          <Text>{task.description}</Text>
                        </Paper>
                      </Link>
                    </Card>
                  )
                })
              }
            </Board>
          </div>
          <div>
            <Badge color="green" className='kanbanHeader'>Done</Badge>
            <Board docIndex={docIndex} id='doneBoard' className='board'>
              {
                state[docIndex]._inbox.filter((task: TaskType) =>
                  task.status == Status.Done && isDueThisWeek(new Date(task.dueDate))).map((task) => {
                    return (
                      <Card docIndex={docIndex} id={task.taskID.toString()} className="card">
                        <Link to={`/docs/${docIndex}/task/${getTaskIndex(docIndex, task.taskID)}`} state={{ docIndex: docIndex, task: task }}>
                          <Paper shadow="xs" p="md" withBorder>
                            <Text>{task.description}</Text>
                          </Paper>
                        </Link>
                      </Card>
                    )
                  })
              }
            </Board>
          </div>
        </div>
      </Block>

    </div>
  )
}
