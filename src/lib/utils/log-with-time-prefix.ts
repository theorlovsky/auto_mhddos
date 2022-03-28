import { DateTime } from 'luxon';
import { chalk } from 'zx';

export type LogLevel = 'info' | 'warning' | 'error';

export function logWithTimePrefix(level: LogLevel, message: any, ...optionalParams: any[]): void;

export function logWithTimePrefix(message: any, ...optionalParams: any[]): void;

export function logWithTimePrefix(levelOrMessage: LogLevel | any, messageOrParam: any, ...optionalParams: any[]): void {
  const level = isLogLevel(levelOrMessage) ? levelOrMessage : 'info';
  const style = level === 'info' ? chalk.reset : level === 'warning' ? chalk.yellowBright : chalk.redBright;
  const message = isLogLevel(levelOrMessage) ? messageOrParam : levelOrMessage;

  console.log(style(`[${DateTime.now().toFormat('TT')} – ${level.toUpperCase()}]:`, message, ...optionalParams));
}

function isLogLevel(value: any): value is LogLevel {
  const logLevels: LogLevel[] = ['info', 'warning', 'error'];

  return logLevels.includes(value);
}
