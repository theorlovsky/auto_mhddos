export interface AutoMhddosArguments extends Record<string, any> {
  /**
   * Number of parallel attacks to run. Can't be less than 1 and more than the number of targets.
   *
   * If 'all' is passed, all the targets will be attacked simultaneously.
   */
  parallel: number | 'all';

  /**
   * Disables the upper limit of {@link parallel} and allows any number of attacks on the same target.
   */
  disableParallelLimit: boolean;

  /**
   * Interval for stopping running attacks, re-fetching targets and starting new attacks.
   * Can't be less than 15 minutes.
   *
   * Supported units: m, h, d.
   *
   * Examples: 15m, 2h, 1d.
   */
  restartInterval: string;
}
