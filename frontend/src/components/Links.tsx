import React, { useContext, useState } from 'react'
import { Input } from '@mantine/core'
import { GlobalState } from '../GTWContext'
import { Link, TaskType } from '../types/types'
import { GTW } from '../LocalStorage'

interface Props {
  docID: number,
  taskID: number
}

export const Links: React.FC<Props> = ({ docID, taskID }) => {

  const { state, setState } = useContext(GlobalState)
  const { updateTask, getTask, getGTW} = GTW()
  const [linksList] = useState<Link[] | null>(() => {
    console.log(taskID)
    if (state[docID]._inbox[taskID].referenceMaterial != null){
      return state[docID]._inbox[taskID].referenceMaterial.links
    }else{
      return []  
    }
  })
  const [title, setTitle] = useState("")
  const [href, setHref] = useState("")

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      console.log('do validate')

      const link: Link = {
        src: href,
        title: title,
        date_added: new Date().toISOString().slice(0, 10)
      }

      linksList.push(link)

      const updatedTask: TaskType = {
        ...getTask(taskID, docID),
        referenceMaterial: {
          notes: getTask(taskID, docID).referenceMaterial.notes,
          links: linksList,
          media: getTask(taskID, docID).referenceMaterial != null ?
            getTask(taskID, docID).referenceMaterial.media : null,
        } 
      }

      updateTask(docID, taskID, updatedTask)
      setState(getGTW())

      setTitle("")
      setHref("")
    }
  }

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '40% 1fr' }}>
          <Input
            placeholder="Title"
            value={title}
            onKeyDown={handleKeyDown}
            onChange={(event: any) => setTitle(event.currentTarget.value)}
          />
          <Input
            placeholder="Link"
            value={href}
            onKeyDown={handleKeyDown}
            onChange={(event: any) => setHref(event.currentTarget.value)}
          />
        </div>
        <div style={{display: 'flex', flexDirection:'column', height: '30vh', overflowY: 'auto'}}>
          {
            linksList != null ?
              linksList.map((link: Link) => {
                return <span>● {link.title}: <a href={link.src} target="_blank" style={{textDecoration: 'underline'}}>{link.src}</a></span>
              })
              : <></>
          }
        </div>
      </>
    )
  }