import { Subject } from 'rxjs';

const exitSubject = new Subject<number>();

export const exit$ = exitSubject.asObservable();

export function exit(code: number = 1): void {
  process.exitCode = code;
  exitSubject.next(code);
}
