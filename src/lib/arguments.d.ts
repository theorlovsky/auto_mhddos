import { argv } from 'zx';

export type Arguments = typeof argv & {
  /**
   * Number of parallel attacks to run. Can't be less than 1.
   */
  parallel: number;
};
