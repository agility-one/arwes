import { createFrame, createFrameUnderlineSettings } from '@arwes/frames'
import { createAnimatorSystem } from '@arwes/animator'

let active = false
const system = createAnimatorSystem()
const animator = system.register(undefined, {
  getSettings: () => ({ active, duration: { enter: 1, exit: 1 } }),
  setSettings: () => {},
  getForeignRef: () => {},
  setForeignRef: () => {}
})

const root = document.querySelector('#root')!
root.innerHTML = `
  <div
    style="
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      --arwes-frames-bg-color: hsl(180, 75%, 10%);
      --arwes-frames-line-color: hsl(180, 75%, 25%);
      --arwes-frames-deco-color: hsl(180, 75%, 50%);
    "
  >
    <svg class="frame frame1" width="200" height="200" xmlns="http://www.w3.org/2000/svg"></svg>
    <svg class="frame frame2" width="300" height="300" xmlns="http://www.w3.org/2000/svg"></svg>
  </div>

  <style>
    .frame { outline: 1px dashed hsl(180 0% 50% / 0.1); }
  </style>
`

createFrame(root.querySelector<SVGSVGElement>('.frame1')!, {
  animator,
  ...createFrameUnderlineSettings({
    // styled: true,
    // animated: true,
    // padding: 0,
    // squareSize: 16,
    // strokeWidth: 1
  })
})

createFrame(root.querySelector<SVGSVGElement>('.frame2')!, {
  animator,
  ...createFrameUnderlineSettings({
    padding: 4,
    squareSize: 30,
    strokeWidth: 4
  })
})

const update = (): void => {
  active = !active
  animator.send('update')
  setTimeout(update, active ? 3_000 : 1_500)
}

animator.send('setup')
update()
