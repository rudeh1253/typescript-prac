const add = (a: number, b: number = 1): number => a + b;
const printOutput: (a: number | string) => void = (output: number | string): void => console.log(output);

printOutput(add(15));