
function logger(name: string) {
  return (...args: any[]) => {
    console.log(`[${name}]`, ...args);
  }
}

export { logger };
