import React from 'react'

interface Props{
    docIndex: number
    id: string
    className: string
    children: React.ReactNode
}

export const Card: React.FC<Props> = ({docIndex, id, className, children}) => {

  const dragOver = (e: any) => {
    e.stopPropagation()
  }

  const dragStart = (e: any) => {
    const target = e.currentTarget   
    e.dataTransfer.setData('cardID', target.id)
    setTimeout(()=>{
      target.style.display = "none"
    },0)
  }

  return (
    <div
      id={id}
      onDragStart={dragStart}
      draggable='true'
      className={className}
      onDragOver={dragOver}
    >
      {children}  
    </div>
  )
}
