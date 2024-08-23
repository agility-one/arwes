import { transitionTextSequence } from '@arwes/text'

const root = document.querySelector('#root')!

root.innerHTML = `
  <h1
    id="rootElement"
    style="position: relative; color: #0dd;"
  >
    <div
      id="contentElement"
      style="position: relative;"
    >Futuristic Sci-Fi UI Web Framework</div>
  </h1>
`

const rootElement = document.querySelector<HTMLElement>('#rootElement')!
const contentElement = document.querySelector<HTMLElement>('#contentElement')!

transitionTextSequence({
  rootElement,
  contentElement,
  duration: 1
  // easing: 'linear',
  // blink: true,
  // blinkDuration: 0.1,
  // isEntering: true,
  // hideOnExited: true,
  // hideOnEntered: false
})
