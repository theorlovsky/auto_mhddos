import { DateTime } from 'luxon';
import {
  catchError,
  defer,
  from,
  map,
  MonoTypeOperatorFunction,
  Observable,
  of,
  OperatorFunction,
  pipe,
  retry,
  switchMap,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { $, chalk, quiet } from 'zx';
import { ACTIVE_NON_UDP_TARGETS_REGEX, ACTIVE_UDP_TARGETS_REGEX, MINUTE, SECOND, TARGETS_URL } from '../constants';
import { logWithTimePrefix } from '../utils/log-with-time-prefix';

export function fetchTargets(): Observable<string[]> {
  return defer(() => {
    logWithTimePrefix(chalk('Fetching targets'));

    return from(quiet($`curl ${TARGETS_URL}`)).pipe(
      map(({ stdout: result }) => {
        if (result.startsWith('404:')) {
          throw new Error('Failed to fetch targets: file not found.');
        }

        return result;
      }),
      catchError(() => {
        return throwError(
          () => new Error("Failed to fetch targets. Something's wrong with the targets file or your connection."),
        );
      }),
    );
  }).pipe(
    retryIncrementally(),
    // show warning if there are active UDP targets
    checkForUdpTargets(),
    // getting all active non-UDP targets
    matchTargets(),
    cleanUp(),
    removeDuplicates(),
    retryIfEmpty(),
  );
}

function checkForUdpTargets(): MonoTypeOperatorFunction<string> {
  return tap((text) => {
    if (ACTIVE_UDP_TARGETS_REGEX.test(text)) {
      logWithTimePrefix(
        'warning',
        chalk.yellowBright('There are UDP targets that are not supported by this tool. They were ignored'),
      );
    }
  });
}

function matchTargets(): OperatorFunction<string, string[]> {
  return map((text) => text.match(ACTIVE_NON_UDP_TARGETS_REGEX) || []);
}

function cleanUp(): MonoTypeOperatorFunction<string[]> {
  return map((targets) => {
    return targets.map((target) => target.replace('runner.py ', '').trim());
  });
}

function removeDuplicates(): MonoTypeOperatorFunction<string[]> {
  return map((targets) => [...new Set(targets)]);
}

function retryIncrementally(): MonoTypeOperatorFunction<string> {
  return retry({
    delay: (error: Error, retryCount) => {
      const retryDelay = Math.min(retryCount * 5 * SECOND, MINUTE);

      logWithTimePrefix(
        'error',
        chalk.redBright(error.message),
        chalk.redBright(`Retrying ${getRetryTime(retryDelay)}`),
      );

      return timer(retryDelay);
    },
    resetOnSuccess: true,
  });
}

function retryIfEmpty(): MonoTypeOperatorFunction<string[]> {
  return pipe(
    switchMap((targets) => {
      return targets.length ? of(targets) : throwError(() => new Error('There are currently no active targets.'));
    }),
    retry({
      delay: (error: Error) => {
        const retryDelay = MINUTE * 5;

        logWithTimePrefix(
          'warning',
          chalk.yellowBright(error.message),
          chalk.yellowBright(`Checking again ${getRetryTime(retryDelay)}`),
        );

        return timer(retryDelay);
      },
      resetOnSuccess: true,
    }),
  );
}

function getRetryTime(delay: number): string {
  const now = DateTime.now();

  return now.plus({ millisecond: delay }).toRelative({ base: now, style: 'long' })!;
}
