function trimZero(num: number, fractionDigits = 1) {
  return num.toFixed(fractionDigits).replace(/\.?0+$/, "");
}

export function humanizeNumber(num: number) {
  if (num >= 10000) {
    return trimZero(num / 10000) + "W";
  }
  if (num >= 1000) {
    return trimZero(num / 1000) + "K";
  }
  return num.toString();
}

export function percent(a: number, b: number, fractionDigits = 1) {
  return trimZero(b != 0 ? (a / b) * 100 : 0, fractionDigits) + "%";
}
