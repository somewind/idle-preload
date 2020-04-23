export interface IdlePreloadOptions {
  /**
   * default 5
   */
  varianceLimit?: number,
  /**
   * default 5
   */
  samplingCount?: number,
  /**
   * default true
   */
  afterWindowLoad?: boolean,
  /**
   * default 200 (ms)
   */
  checkTimeInterval?: number,
  /**
   * default boolean
   */
  debug?: boolean
}

export interface IdlePreloadInstance {
  /**
   * add task
   */
  push: (...tasks: Array<() => void>) => IdlePreloadInstance
  /**
   * start idle detect
   */
  start: () => void
}

export function idlePreload(options?: IdlePreloadOptions): IdlePreloadInstance
