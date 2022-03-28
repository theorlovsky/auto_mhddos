import { fromEvent, take, takeUntil, tap } from 'rxjs';
import { exit, exit$ } from './utils/exit';
import { logWithTimePrefix } from './utils/log-with-time-prefix';

export const handleSigInt$ = fromEvent(process, 'SIGINT').pipe(
  take(1),
  tap(() => {
    // empty line after ^C
    console.log('');
    logWithTimePrefix('Gracefully stopping');
    exit(2);
  }),
  takeUntil(exit$),
);
