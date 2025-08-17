type LogLevel = 'info' | 'warn' | 'error';

interface LogFields {
  [key: string]: unknown;
}

function log(level: LogLevel, message: string, fields?: LogFields) {
  const body = {
    level,
    msg: message,
    time: new Date().toISOString(),
    ...fields,
  };
  const line = JSON.stringify(body);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else if (typeof process !== 'undefined' && process.stdout) {
    process.stdout.write(line + '\n');
  }
}

export const logger = {
  info: (msg: string, fields?: LogFields) => log('info', msg, fields),
  warn: (msg: string, fields?: LogFields) => log('warn', msg, fields),
  error: (msg: string, fields?: LogFields) => log('error', msg, fields),
};
