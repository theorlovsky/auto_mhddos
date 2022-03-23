import { Subject } from 'rxjs';
import { logWithTimePrefix } from './utils/log-with-time-prefix';

const exitSubject = new Subject<number>();

export const exit$ = exitSubject.asObservable();

export function exit(code: number = 1): void {
  exitSubject.next(code);

  setTimeout(() => {
    logWithTimePrefix('Exited');
    process.exit(code);
  });
}
