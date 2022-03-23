import { map, MonoTypeOperatorFunction } from 'rxjs';
import { chalk } from 'zx';
import { ParsedArguments } from '../arguments/arguments';
import { getRandomItem } from '../utils/get-random-item';
import { logWithTimePrefix } from '../utils/log-with-time-prefix';

export function getRandomTargets(parallel: ParsedArguments['parallel']): MonoTypeOperatorFunction<string[]> {
  return map((targets) => {
    const computedParallel = computeParallel(targets, parallel);
    const randomTargets: string[] = [];

    logWithTimePrefix(chalk(`Choosing ${computedParallel} random target${computedParallel === 1 ? '' : 's'}`));

    while (randomTargets.length < computedParallel) {
      const randomTarget = getRandomItem(targets);

      if (
        // evenly distributing targets
        !randomTargets.includes(randomTarget) ||
        // randomly distributing targets with disabled upper limit
        randomTargets.length >= targets.length
      ) {
        randomTargets.push(randomTarget);
      }
    }

    return randomTargets;
  });
}

function computeParallel(targets: string[], parallel: ParsedArguments['parallel']): number {
  return parallel === 'all' ? targets.length : Math.max(parallel, 1);
}
