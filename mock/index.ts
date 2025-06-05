export function initialize(num: number, value: number) {
  return isNaN(num) ? value : num;
}
