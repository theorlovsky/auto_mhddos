import { finalize, fromEvent, take } from 'rxjs';
import { logWithTimePrefix } from './utils/log-with-time-prefix';

export const logExit$ = fromEvent(process, 'exit').pipe(
  take(1),
  finalize(() => {
    logWithTimePrefix('Exited');
  }),
);
