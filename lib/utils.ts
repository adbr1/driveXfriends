export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function pad(value: number, length: number): string {
  return value.toString().padStart(length, "0");
}

export function formatKm(value: number): string {
  const v = Math.max(0, value);
  const whole = Math.floor(v);
  const decimals = Math.floor((v - whole) * 1000);
  return `${pad(whole, 3)}.${pad(decimals, 3)}`;
}
