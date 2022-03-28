import {
  catchError,
  defer,
  distinctUntilChanged,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';
import { fetch } from 'zx';
import { exit$ } from './exit';

export const connection$ = defer(() =>
  timer(0, 1000).pipe(
    switchMap(() => checkConnection()),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
    takeUntil(exit$),
  ),
);

export function checkConnection(): Observable<boolean> {
  return defer(() => fetch('https://1.1.1.1/', { method: 'HEAD' })).pipe(
    map(() => true),
    catchError(() => of(false)),
  );
}
