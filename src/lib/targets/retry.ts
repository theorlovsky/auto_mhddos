import { MonoTypeOperatorFunction, retry as rxjsRetry, timer } from 'rxjs';
import { MINUTE } from '../constants';
import { getRelativeTimeFromNow } from '../utils/get-relative-time-from-now';
import { LogLevel, logWithTimePrefix } from '../utils/log-with-time-prefix';

export function retry<T>({
  delay = MINUTE,
  logLevel = 'error',
}: {
  delay?: number;
  logLevel?: LogLevel;
} = {}): MonoTypeOperatorFunction<T> {
  return rxjsRetry({
    delay: (error: Error) => {
      logWithTimePrefix(logLevel, error.message, getRelativeTimeFromNow({ millisecond: delay }));

      return timer(delay);
    },
    resetOnSuccess: true,
  });
}
