import parseArgs, { Opts } from 'minimist';
import { Observable, of } from 'rxjs';
import { parseFlags } from '../utils/parse-flags';
import { Arguments, ParsedArguments } from './arguments';
import { parseRestartInterval } from './parse-restart-interval';

const parseOptions: Opts = {
  alias: {
    restartInterval: 'restart-interval',
    threads: 't',
    help: 'h',
    period: 'p',
    httpMethods: 'http-methods',
  },
  default: {
    debug: true,
    parallel: 1,
    restartInterval: '30m',
    threads: 1000,
  },
};

export function parseArguments(): Observable<ParsedArguments> {
  const { parallel, restartInterval, threads, help, period, debug, rpc, httpMethods } = parseArgs<Arguments>(
    process.argv.slice(2),
    parseOptions,
  );

  return of({
    parallel,
    restartInterval: parseRestartInterval(restartInterval),
    mhddosFlags: parseFlags({
      threads,
      help,
      period,
      debug,
      rpc,
      'http-methods': httpMethods,
    }),
  });
}
