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
  const { getTaskIndex, getDocIndex } = GTW()

  const index = getDocIndex(docIndex)
  const [tasks] = useState<TaskType[]>(state[index]._inbox)

  const currentDate = new Date();
  const currentWeek = currentDate.getDay() <= 3 ? currentDate.getDay() + 4 : currentDate.getDay() - 3;

  const isDueThisWeek = (dueDate: Date) => {
    // Get the current date (with time set to midnight)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get the date 7 days from now
    const sevenDaysFromNow = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Check if the target date is within the next 7 days from the current date
    return dueDate.getTime() >= currentDate.getTime() && dueDate.getTime() <= sevenDaysFromNow.getTime()
  }
  const isOverdue = (task: TaskType) => {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return task.status != Status.Done && currentDate.getTime() > dueDate.getTime()
  }

  return (
    <div className={'dashboard'}>
      <Block docIndex={index} blockName={"Capture"} style={{ height: '25vh' }} allowed={null}>
        <CaptureBlock docIndex={index} refStart={null} refEnd={null}/>
      </Block>
      <Block docIndex={index} blockName={"Overdue"} style={{ height: '20vh' }} allowed={null}>
        <InboxList docIndex={index} tasks={tasks} meetsCondition={isOverdue} showResolved={false} />
      </Block>
      <Block docIndex={index} blockName={"Due Soon"} style={{ height: '50vh' }} allowed={null}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '1em', gap: '1em', overflow: 'auto' }}>
          <div>
            <Badge color="blue" className='kanbanHeader'>To Do</Badge>
            <Board docIndex={index} id='todoBoard' className='board'>
              {
                state[index]._inbox.filter((task: TaskType) =>
                  task.status == Status.Todo && isDueThisWeek(new Date(task.dueDate))).map((task) => {
                    return (
                      <Card docIndex={index} id={task.taskID.toString()} className="card">
                        <Link to={`/docs/${task.projectID}/task/${getTaskIndex(index, task.taskID)}`} state={{ index: index, task: task }}>
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
            <Board docIndex={index} id='doingBoard' className='board'>
              {
                state[index]._inbox.filter((task: TaskType) =>
                  (task.status == Status.Doing) && isDueThisWeek(new Date(task.dueDate))
                ).map((task) => {
                  return (
                    <Card docIndex={index} id={task.taskID.toString()} className="card">
                      <Link to={`/docs/${task.projectID}/task/${getTaskIndex(index, task.taskID)}`} state={{ index: index, task: task }}>
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
            <Board docIndex={index} id='doneBoard' className='board'>
              {
                state[index]._inbox.filter((task: TaskType) =>
                  task.status == Status.Done && isDueThisWeek(new Date(task.dueDate))).map((task) => {
                    return (
                      <Card docIndex={index} id={task.taskID.toString()} className="card">
                        <Link to={`/docs/${task.projectID}/task/${getTaskIndex(index, task.taskID)}`} state={{ index: index, task: task }}>
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
