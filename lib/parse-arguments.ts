import { AutoMhddosArguments } from './arguments';

export function parseArguments(args: Record<string, any>): AutoMhddosArguments {
  const {
    _, // we don't need positional arguments
    c, // we don't need custom targets
    config, // we don't need custom targets
    parallel = 1,
    'disable-parallel-limit': disableParallelLimit = false,
    'restart-interval': restartInterval = '30m',
    debug = true,
    t = 1000,
    ...mhddosArgs
  } = args;

  return { parallel, disableParallelLimit, restartInterval, debug, t, ...mhddosArgs };
}
