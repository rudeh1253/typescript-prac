// const add = (a: number, b: number = 1): number => a + b;
// const printOutput: (a: number | string) => void = (output: number | string): void => console.log(output);

// printOutput(add(15));

// Spread Operator
const hobbies = ["Sports", "Cooking"];
const activehobbies = ["Hiking"];

// activehobbies.push(...hobbies);
// activehobbies.forEach(e => console.log(e));

const person = {
    firstName: "max",
    age: 30
};

const copiedPerson = {...person, firstName: "kim"};
console.log(copiedPerson)

// Rest Parameters
const add = (...numbers: number[]) => {
    return numbers.reduce((currentResult, currentValue) => currentResult + currentValue, 0);
};

const addedNumbers = add(5, 10, 2, 3.7);
console.log(addedNumbers);

// Array Destructuing
const [hobby1, hobby2] = hobbies;
const [hobby3, hobby4, ...remainingHobbies] = hobbies;

// Object Destructuring
const {firstName: username, age} = person;
console.log(username, age);