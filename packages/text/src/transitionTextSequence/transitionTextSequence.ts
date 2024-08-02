import { filterProps } from '@arwes/tools'
import { type Animation, createAnimation, easeAmong } from '@arwes/animated'

import type { TextTransitionProps } from '../types.js'
import { walkTextNodes } from '../internal/walkTextNodes/index.js'
import { setTextNodesContent } from '../internal/setTextNodesContent/index.js'

type TransitionTextSequenceProps = TextTransitionProps & {
  blink?: boolean
  blinkDuration?: number
}

const transitionTextSequence = (props: TransitionTextSequenceProps): Animation => {
  const {
    rootElement,
    contentElement,
    duration,
    easing = 'linear',
    blink = true,
    blinkDuration = 0.1,
    isEntering = true,
    hideOnExited = true,
    hideOnEntered
  } = filterProps(props)

  // If no valid elements are provided, return an void animation for type safety.
  if (!rootElement || !contentElement) {
    return {
      finished: Promise.resolve(),
      isPending: () => false,
      cancel: () => {}
    }
  }

  let blinkElement: HTMLElement | undefined
  let blinkAnimation: Animation | undefined

  const cloneElement = contentElement.cloneNode(true) as HTMLElement
  Object.assign(cloneElement.style, {
    position: 'absolute',
    inset: 0,
    visibility: 'visible',
    opacity: 1
  })

  if (blink) {
    blinkElement = document.createElement('span')
    blinkElement.classList.add('arwes-text__blink')
    blinkElement.innerHTML = '&#9614;'
    Object.assign(blinkElement.style, {
      position: 'relative',
      display: 'inline-block',
      width: 0,
      height: 0,
      lineHeight: '0',
      color: 'inherit'
    })
  }

  const textNodes: Node[] = []
  const texts: string[] = []

  walkTextNodes(cloneElement, (child) => {
    textNodes.push(child)
    texts.push(child.textContent || '')

    if (isEntering) {
      child.textContent = ''
    }
  })

  const length = texts.join('').length

  rootElement.appendChild(cloneElement)
  contentElement.style.visibility = 'hidden'

  if (blink && blinkElement) {
    const blinkAnimationEaseColor = easeAmong([0, 1, 2])
    const blinkAnimationColors = ['transparent', 'inherit', 'transparent']
    blinkAnimation = createAnimation({
      duration: blinkDuration,
      easing: 'linear',
      repeat: Infinity,
      onUpdate(progress) {
        const index = Math.round(blinkAnimationEaseColor(progress))
        blinkElement!.style.color = blinkAnimationColors[index]
      }
    })
  }

  return createAnimation({
    duration,
    easing,
    direction: isEntering ? 'normal' : 'reverse',
    onUpdate: (progress) => {
      const newLength = Math.round(progress * length)
      setTextNodesContent(textNodes, texts, newLength, (textNode) => {
        // If blink, put the blink element at the end of the text rendered.
        if (
          blinkElement &&
          textNode.parentNode &&
          textNode.parentNode !== blinkElement.parentNode
        ) {
          textNode.parentNode.appendChild(blinkElement)
        }
      })
    },
    onFinish: () => {
      contentElement.style.visibility =
        (isEntering && hideOnEntered) || (!isEntering && hideOnExited) ? 'hidden' : 'visible'
      cloneElement.remove()
      blinkAnimation?.cancel()
    },
    onCancel: () => {
      contentElement.style.visibility = ''
      cloneElement.remove()
      blinkAnimation?.cancel()
    }
  })
}

export type { TransitionTextSequenceProps }
export { transitionTextSequence }
