import { styleFrameClipOctagon } from '@arwes/frames'

const root = document.querySelector('#root')!
const box = document.createElement('div')

root.appendChild(box)
Object.assign(box.style, {
  width: '200px',
  height: '100px',
  clipPath: styleFrameClipOctagon({
    leftTop: true,
    rightTop: false,
    rightBottom: true,
    leftBottom: false
  }),
  background: '#077'
})
