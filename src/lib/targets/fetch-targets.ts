import { catchError, defer, from, Observable, switchMap, throwError } from 'rxjs';
import { fetch } from 'zx';
import { retry } from './retry';

export function fetchTargets(): Observable<string> {
  return defer(() => from(fetch(process.env.TARGETS_URL!))).pipe(
    switchMap((response) => (response.ok ? response.text() : fetchTargetsError(response.status))),
    catchError(() => fetchTargetsError()),
    retry(),
  );
}

function fetchTargetsError(status: number = 500): Observable<never> {
  const message =
    status === 404 ? 'targets file not found' : "something's wrong with the targets file or your connection";

  return throwError(() => new Error(`Failed to fetch targets: ${message}. Retrying`));
}
