import { Duration, DurationLikeObject } from 'luxon';
import { chalk } from 'zx';
import { MINUTE } from '../constants';
import { exit } from '../exit';
import { assertNever } from '../utils/assert-never';
import { logWithTimePrefix } from '../utils/log-with-time-prefix';

export type RestartIntervalUnit = 'm' | 'h' | 'd';

export type Milliseconds = number;

export function parseRestartInterval(interval: string): Milliseconds {
  const match = interval.match(/(\d+)([mhd])/);

  if (match === null) {
    logWithTimePrefix('error', chalk.redBright('Unknown --restart-interval pattern'));
    exit(1);
    return Infinity;
  }

  const value = match[1];
  const unit = match[2] as RestartIntervalUnit;

  const durationUnit = getDurationLikeUnit(unit);
  const duration = Duration.fromDurationLike({ [durationUnit]: parseInt(value, 10) });

  return Math.max(duration.as('milliseconds'), MINUTE * 15);
}

function getDurationLikeUnit(unit: RestartIntervalUnit): keyof DurationLikeObject {
  switch (unit) {
    case 'm': {
      return 'minutes';
    }

    case 'h': {
      return 'hours';
    }

    case 'd': {
      return 'days';
    }

    default: {
      assertNever(unit);
    }
  }
}
