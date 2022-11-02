import React from 'react'

interface Props{
  displayContent: string
}

export const LivePreview: React.FC<Props> = ({displayContent}) => {
  return (
    <div style={{"backgroundColor": "white", "height": "100vh"}}>
      {displayContent}
    </div>
  )
}
