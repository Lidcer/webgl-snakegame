export function clamp(number: number, min: number, max: number) {
    if (number > max) return max;
    if (number < min) return min;
    return number;
}

export function random(min: number, max: number, float?: boolean) {
  if (float) return Math.random() * (max - min + 1) + min;
  else return Math.floor(Math.random() * (max - min + 1) ) + min;
}

export function sample(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}
