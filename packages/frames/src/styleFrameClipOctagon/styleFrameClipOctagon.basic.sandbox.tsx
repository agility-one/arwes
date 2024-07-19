import { styleFrameClipOctagon } from '@arwes/frames'

const root = document.querySelector('#root')!
const box = document.createElement('div')

root.appendChild(box)
Object.assign(box.style, {
  width: '200px',
  height: '100px',
  clipPath: styleFrameClipOctagon({ squareSize: '1rem' }),
  background: '#077'
})
