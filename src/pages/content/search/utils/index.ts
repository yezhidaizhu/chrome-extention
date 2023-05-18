export function uid(len = 6) {
  return Math.random().toString(16).slice(-len);
}
