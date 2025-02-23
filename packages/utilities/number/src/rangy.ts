import {
  clamp,
  decrement,
  getMaxPrecision,
  increment,
  isAtMax,
  isAtMin,
  isWithinRange,
  Num,
  percentToValue,
  roundToPrecision,
  snapToStep,
  valueOf,
  valueToPercent,
} from "./number"

export type RangeOptions<T = string | number> = Num<"min" | "max"> & {
  step: number
  precision?: number
  value: T
}

export function rangy(o: RangeOptions) {
  const wrap = (v: string | number) => rangy({ ...o, value: v })
  return {
    isInRange: isWithinRange(o.value, o),
    isAtMax: isAtMax(o.value, o),
    isAtMin: isAtMin(o.value, o),
    percent: valueToPercent(o.value, o),
    valueAsNumber: valueOf(o.value),
    value: roundToPrecision(o.value, o),
    precision: getMaxPrecision(o),
    snapToStep: () => wrap(snapToStep(o.value, o.step)),
    increment: (s?: number) => wrap(increment(o.value, s || o.step)),
    decrement: (s?: number) => wrap(decrement(o.value, s || o.step)),
    toMax: () => wrap(o.max),
    toMin: () => wrap(o.min),
    fromPercent: (p: number) => wrap(percentToValue(p, o)),
    clamp: () => wrap(clamp(o.value, o)),
  }
}
