
type LoggerFn = (...args: any[]) => void;

interface Logger {
  info: LoggerFn;
  warn: LoggerFn;
  error: LoggerFn;
}

function log(level: keyof Logger, tag: string) {
  return (...args: any[]) => {
    console[level](`[${tag}]`, ...args);
  }
}

function logger(tag: string): Logger {
  return {
    info: log("info", tag),
    warn: log("warn", tag),
    error: log("error", tag),
  }
}

export { logger };
