import React, { useContext, useState, useEffect } from 'react'
import { Tabs, Textarea, Image } from '@mantine/core'
import { IconPhoto, IconLink, IconNotes, IconCircleCheck } from '@tabler/icons-react';
import { GlobalState } from '../GTWContext';
import { GTW } from '../LocalStorage'
import { TaskType } from '../types/types';
import {Links} from '../components/Links'
import {Medias} from '../components/Medias'

interface Props {
  docID: number,
  taskID: number
}

export const ReferenceMaterial: React.FC<Props> = ({ docID, taskID }) => {

  const { state, setState } = useContext(GlobalState)
  const { getTask, updateTask, getGTW } = GTW()

  const [notes, setNotesContent] = useState<string>(() => {
    if (getTask(taskID, docID).referenceMaterial != null) {
      return getTask(taskID, docID).referenceMaterial.notes
    } else {
      return ""
    }
  })

  const [saveIcon, showSaveIcon] = useState(false)

  const automaticallySaveNotes = async (content: string) => {
    setNotesContent(content)
    const updatedTask: TaskType = {
      ...getTask(taskID, docID),
      referenceMaterial: {
        notes: content,
        links:
          getTask(taskID, docID).referenceMaterial != null
            ?
            getTask(taskID, docID).referenceMaterial.links
            :
            null,
        media: getTask(taskID, docID).referenceMaterial != null ? 
        getTask(taskID, docID).referenceMaterial.media : null ,
      }
    }

    updateTask(docID, taskID, updatedTask)
    setState(getGTW())
    showSaveIcon(true)
    await new Promise(r => setTimeout(r, 1000))
    showSaveIcon(false)
  }

  return (
    <div style={{
    width: '95%',
    margin: '0 auto'
  }}>
      <Tabs variant="outline" defaultValue="gallery">
        <Tabs.List>
          <Tabs.Tab value="notes" icon={<IconNotes size="0.8rem" />}>Notes</Tabs.Tab>
          <Tabs.Tab value="links" icon={<IconLink size="0.8rem" />}>Articles/Links</Tabs.Tab>
          <Tabs.Tab value="media" icon={<IconPhoto size="0.8rem" />}>Media</Tabs.Tab>
          {
            saveIcon ?
              <Tabs.Tab value="success" disabled ml='auto' icon={<IconCircleCheck size="0.8rem" />}>Saved</Tabs.Tab>
              : <></>
          }
        </Tabs.List>

        <Tabs.Panel value="notes" pt="xs">
          <Textarea label="Write notes here" value={notes} onChange={(event) => automaticallySaveNotes(event.currentTarget.value)} />
        </Tabs.Panel>

        <Tabs.Panel value="links" pt="xs">
          <Links docID={docID} taskID={taskID}/>
        </Tabs.Panel>

        <Tabs.Panel value="media" pt="xs">
          <Medias docID={docID} taskID={taskID} />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}