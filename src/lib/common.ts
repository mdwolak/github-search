// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNumber(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function camelCaseToSpacedOut(camelCase: string): string {
  const spacedOut = camelCase.replace(/([A-Z])|_/g, " $1");
  return spacedOut
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function classNames(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HandleCloseProps<T = any> = {
  handleClose: (data?: T) => void;
};

export type NonNullableProps<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

export function stripNullishProps<T>(obj: T): NonNullableProps<T> {
  return Object.fromEntries(
    Object.entries(obj ?? {}).filter(([, value]) => value != null)
  ) as NonNullableProps<T>;
}

export const truncate = (str: string, maxLength: number) => {
  return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
};

function isValidDate(date: Date) {
  return !isNaN(date.getTime());
}

/**
 * Create a date YYYY-MM-DD date string that is typecast as a `Date`.
 * Hack when using `defaultValues` in `react-hook-form`
 * This is because `react-hook-form` doesn't support `defaultValue` of type `Date` even if the types say so
 * @see https://github.com/orgs/react-hook-form/discussions/4718#discussioncomment-2738053
 */
export function dateToInputDate(date?: Date) {
  if (!date || !isValidDate(date)) {
    return undefined;
  }
  return date.toISOString().slice(0, 10) as unknown as Date;
}

export function dateToInputTime(date?: Date) {
  if (!date || !isValidDate(date)) {
    return undefined;
  }
  return date.toISOString().slice(11, 16) as unknown as Date;
}
export const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const weekDaysOptions = weekDays.map((day, index) => ({
  value: index + 1,
  name: day.substring(0, 3),
}));

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
export const formatTime = (date: Date) => formatter.format(date);

/**
 * Group an array of objects by a property of the object
 *
 * Usage:
 * const grouped = groupArrayByObjectProperty(data.scheduleDays, (scheduleDay) => scheduleDay.dayOfWeek),
 */
export const groupArrayByObjectProperty = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
  K extends keyof T,
  P extends T[K] | string | number
>(
  array: T[],
  attributeGetter: (item: T) => P
): Record<P, T[]> =>
  array.reduce((previous, current) => {
    const value = attributeGetter(current);
    previous[value] = (previous[value] || []).concat(current);
    return previous;
  }, {} as Record<P, T[]>);

const groupArrayByObjectStringProperty = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => string
) =>
  array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });

const groupByToMap = <T, Q>(array: T[], predicate: (value: T, index: number, array: T[]) => Q) =>
  array.reduce((map, value, index, array) => {
    const key = predicate(value, index, array);
    map.get(key)?.push(value) ?? map.set(key, [value]);
    return map;
  }, new Map<Q, T[]>());
