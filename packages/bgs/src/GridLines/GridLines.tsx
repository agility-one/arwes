import React, { ReactElement, useRef } from 'react';
import { animate } from 'motion';
import { cx, mergeRefs, useOnChange } from '@arwes/tools';
import { ANIMATOR_DEFAULT_KEYS, AnimatorSystemNode, useAnimator } from '@arwes/animator';

import { GridLinesProps } from './GridLines.types';

const { ENTERING, EXITING } = ANIMATOR_DEFAULT_KEYS;

const defaultProps: Required<Pick<GridLinesProps, 'lineWidth' | 'lineColor' | 'horizontalLineDash' | 'verticalLineDash' | 'distance'>> = {
  lineWidth: 1,
  lineColor: '#777',
  horizontalLineDash: [4],
  verticalLineDash: [],
  distance: 30
};

const GridLines = (props: GridLinesProps): ReactElement => {
  const propsFull = { ...defaultProps, ...props };
  const {
    elementRef: elementRefExternal,
    className,
    style
  } = propsFull;

  const animator = useAnimator();
  const elementRef = useRef<HTMLCanvasElement>(null);
  const propsFullRef = useRef(propsFull);

  propsFullRef.current = propsFull;

  useOnChange(() => {
    if (!animator) {
      return;
    }

    const canvas = elementRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    let transitionControl: ReturnType<typeof animate> | undefined;
    let resizeObserver: ResizeObserver | undefined;

    const draw = (): void => {
      const {
        lineWidth,
        lineColor,
        horizontalLineDash,
        verticalLineDash,
        distance
      } = propsFullRef.current;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      const xLength = 1 + Math.floor(width / distance);
      const yLength = 1 + Math.floor(height / distance);

      const xMargin = width % distance;
      const yMargin = height % distance;

      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;

      // Horizontal lines.

      ctx.setLineDash(horizontalLineDash);

      for (let yIndex = 0; yIndex < yLength; yIndex++) {
        const y = (yMargin / 2) + (yIndex * distance);

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        ctx.closePath();
      }

      // Vertical lines.

      ctx.setLineDash(verticalLineDash);

      for (let xIndex = 0; xIndex < xLength; xIndex++) {
        const x = (xMargin / 2) + (xIndex * distance);

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.closePath();
      }
    };

    const animatorSubscription = (node: AnimatorSystemNode): void => {
      const state = node.getState();
      const { duration } = node.control.getSettings();

      switch (state) {
        case ENTERING: {
          draw();
          transitionControl = animate(
            canvas,
            { opacity: [0, 1] },
            { duration: duration?.enter, easing: 'ease-out' }
          );
          break;
        }
        case EXITING: {
          transitionControl = animate(
            canvas,
            { opacity: [1, 0] },
            { duration: duration?.exit, easing: 'ease-out' }
          );
          break;
        }
      }
    };

    animator.node.subscribers.add(animatorSubscription);

    if (window.ResizeObserver && !resizeObserver) {
      resizeObserver = new window.ResizeObserver(() => draw());
      resizeObserver.observe(canvas);
    }

    return () => {
      animator.node.subscribers.delete(animatorSubscription);
      transitionControl?.cancel();
      resizeObserver?.disconnect();
    };
  }, [animator]);

  return (
    <canvas
      ref={mergeRefs(elementRef, elementRefExternal)}
      className={cx('arwes-bgs-gridlines', className)}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        display: 'block',
        border: 0,
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        ...style
      }}
    />
  );
};

GridLines.defaultProps = defaultProps as GridLinesProps;

export { GridLines };
