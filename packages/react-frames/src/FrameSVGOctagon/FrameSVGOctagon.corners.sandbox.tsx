import React, { type ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import { FrameSVGOctagon } from '@arwes/react-frames'

const Sandbox = (): ReactElement => {
  return (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      <FrameSVGOctagon
        style={{
          // @ts-expect-error css variables
          '--arwes-frames-bg-color': 'hsl(180, 75%, 10%)',
          '--arwes-frames-line-color': 'hsl(180, 75%, 50%)'
        }}
        squareSize={30}
        leftTop={false}
        rightTop={true}
        rightBottom={true}
        leftBottom={false}
      />
    </div>
  )
}

createRoot(document.querySelector('#root')!).render(<Sandbox />)
