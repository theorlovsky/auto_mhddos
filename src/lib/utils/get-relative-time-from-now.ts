import { DateTime, DurationLike } from 'luxon';

export function getRelativeTimeFromNow(durationLike: DurationLike): string {
  const now = DateTime.now();

  return now.plus(durationLike).toRelative({ base: now, style: 'long' })!;
}
