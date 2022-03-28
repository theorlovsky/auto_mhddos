import { map, MonoTypeOperatorFunction, Observable, pipe } from 'rxjs';
import { fetchTargets } from './fetch-targets';
import { retry } from './retry';

export function getTargets(): Observable<string[]> {
  return fetchTargets().pipe(
    // getting all active non-UDP targets
    map((text) => (text.match(/^(?!#)(?!.*udp.*).+?$/gim) || []).map((target) => target.trim())),
    retryIfEmpty(),
  );
}

function retryIfEmpty(): MonoTypeOperatorFunction<string[]> {
  return pipe(
    map((targets) => {
      if (targets.length) {
        return targets;
      }

      throw new Error('There are currently no active targets. Checking again');
    }),
    retry({ logLevel: 'warning' }),
  );
}
