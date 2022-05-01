import { CSSProperties, ForwardedRef } from 'react';

export interface PuffsProps {
  elementRef?: ForwardedRef<HTMLCanvasElement>
  className?: string
  style?: CSSProperties
  color: string
  /**
   * Number of puffs to create.
   */
  quantity: number
  /**
   * Time interval to animate all puffs.
   */
  interval?: number
  /**
   * Duration of the animation to appear and disappear the puffs.
   */
  duration?: number
  /**
   * Extra padding space in pixels of the canvas so the puffs have space to
   * move when animating.
   */
  padding?: number
  /**
   * Position X offset to animate in pixels. A static value and a dynamic value.
   * @example
   * [10, 50] means it will at least move 10 pixels to the right and plus
   * a random value between 0 and 50 more.
   */
  xOffset?: [number, number]
  /**
   * Position Y offset to animate in pixels. A static value and a dynamic value.
   * @example
   * [10, 50] means it will at least move 10 pixels to the bottom and plus
   * a random value between 0 and 50 more.
   */
  yOffset?: [number, number]
  /**
   * Radius initial value in pixels.
   */
  radiusInitial?: number
  /**
   * Puff radius offset fixed and variation values in pixels.
   * @example
   * [4, 8] means the puff radius will be at least 4 pixels plus a random value
   * between 0 and 8 more.
   */
  radiusOffset?: [number, number]
};
