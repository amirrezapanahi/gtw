import React, { useContext, useState, useEffect, useCallback } from 'react'
import { SimpleGrid, Text, Image, Indicator, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';

interface Props {
    fileIndex: number,
    file: string
  }
  
export const ImageComponent: React.FC<Props> = ({ fileIndex, file }) => {
    const [opened, { open, close }] = useDisclosure(false);

    return(
        <>
        <Modal opened={opened} onClose={close} title="Image">
        <Image
        key={fileIndex}
        src={file}
        />
      </Modal>
        <Image onClick={open}
        key={fileIndex}
        src={file}
        style={{zIndex: '1'}}
      />
      </>
    )
}