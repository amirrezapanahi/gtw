import React, { useContext, useState, useEffect, useCallback } from 'react'
import { SimpleGrid, Text, Image, Indicator, Modal } from '@mantine/core'
import { GlobalState } from '../GTWContext';
import { GTW } from '../LocalStorage'
import { ReferenceMaterialInterface, TaskType } from '../types/types';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { ImageComponent } from './ImageComponent';

interface Props {
  docID: number,
  taskID: number
}

export const Medias: React.FC<Props> = ({ docID, taskID }) => {

  const { state, setState } = useContext(GlobalState)
  const { updateTask, getTask, getGTW, setGTW , localStorageSize} = GTW()
  // const [setFilesCalled, toggleSetFilesCalled] = useState(false)
  const [files, setFiles] = useState<FileWithPath[]>([])
  const [refMaterial, setRefMaterial] = useState<ReferenceMaterialInterface>(
    state[docID]._inbox[taskID].referenceMaterial
  )

  // useEffect(() => {
  //   console.log("toggled file upload: useEffect(files)")
  //   toggleSetFilesCalled(true)
  // },[files])

  useEffect(() => {  
    console.log("updating state with file: useEffect(setFilesCaleld)") 
    console.log(files.length)
    const readFile = async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data);
        };
        reader.onerror = reject;
      });
    }

    const addFiles = async (files) => {
      for (const file of files) {
        const base64data = await readFile(file);
        refMaterial.media.push(base64data as string)
      }
      console.log("refMaterial: " + refMaterial.media.length);
      setRefMaterial(refMaterial)

      const updatedTask: TaskType = {
        ...getTask(taskID, docID),
        referenceMaterial: {
          notes: getTask(taskID, docID).referenceMaterial.notes,
          links: getTask(taskID, docID).referenceMaterial.links,
          media: refMaterial.media,
        }
      }
  
      console.log(updatedTask)
  
      updateTask(docID, taskID, updatedTask)
      setState(getGTW())
      localStorageSize()
    }

    addFiles(files)
    // toggleSetFilesCalled(false)
  }, [files])

  const deleteImg = (index: number) => {
    refMaterial.media.splice(index,1)
    setRefMaterial(refMaterial)
    const updatedTask: TaskType = {
      ...getTask(taskID, docID),
      referenceMaterial: {
        notes: getTask(taskID, docID).referenceMaterial.notes,
        links: getTask(taskID, docID).referenceMaterial.links,
        media: refMaterial.media,
      }
    }
    updateTask(docID, taskID, updatedTask)
    setState(getGTW())
  }

  return (
    <div>
      <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
        <Text align="center">Drop images here</Text>
      </Dropzone>

      <SimpleGrid
        cols={3}
        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
        mt={refMaterial.media.length > 0 ? 'xl' : 0}
        style={{height: '30vh', overflowY: 'auto'}}
      >
        {
          refMaterial.media.map((file, fileIndex) => {
            return (
              <div style={{paddingTop: '0.3em'}}>
                <Indicator inline label={<i className="fa-solid fa-trash" style={{ height: '50%' }}></i>} size={16} onClick={() => deleteImg(fileIndex)}>
                </Indicator>
                <ImageComponent fileIndex={fileIndex} file={file}/>
              </div>
            );
          })
        }
      </SimpleGrid>
    </div>
  );
}