export interface Arguments extends Record<string, any> {
  /**
   * Number of parallel attacks to run. Can't be less than 1 and more than the number of targets.
   *
   * If 'all' is passed, all the targets will be attacked simultaneously.
   */
  parallel: number | 'all';
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

export interface ParsedArguments {
  parallel: number | 'all';
  restartInterval: number;
  mhddosFlags: string[];
}
