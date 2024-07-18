export const splitStringAtIndex = (str: string, index: number, splitterLength: number = 1) =>
  [str.slice(0, index), str.slice(index + splitterLength)]
