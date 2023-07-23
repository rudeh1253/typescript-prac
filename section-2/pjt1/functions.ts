function add(n1: number, n2: number): number {
    return n1 + n2;
}

function printResult(num: number): void {
    console.log("Result: " + num);
}

function undefinedReturnType(): undefined {
    return;
}

function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
    const result = n1 + n2;
    cb(result);
}

let combineValues1: () => number;
let combineValues2: (a: number, b: number) => number;

addAndHandle(13, 25, printResult);

printResult(add(5, 12));