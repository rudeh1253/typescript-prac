const names: Array<string> = []; // string[]

const promise = new Promise<string>((resolve, reject) => {
    setTimeout(() => resolve("This is done!"), 2000);
});

promise.then(result => console.log(result));

// Generic Function
// Type Contraint
function merge<T extends object, U extends object>(objA: T, objB: U): T & U {
    return Object.assign(objA, objB);
}

console.log(merge({name: "Max"}, {age: 30}));
const a = merge({name: "Max"}, {age: 30}).age;

// Another Generic Functions
interface Lengthy {
    length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
    let descriptionText = "Got no value.";
    if (element.length === 1) {
        descriptionText = "Got " + element.length + " element.";
    } else if (element.length > 1) {
        descriptionText = "Got " + element.length + " elements.";
    }
    return [element, descriptionText];
}

console.log(countAndDescribe("Hi there!"));

// keyof
function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
    return obj[key];
}

extractAndConvert({name: "Max"}, "name");

// Generic Classes
class DataStorage<T> {

    constructor(private data: T[]) {}

    addItem(item: T): void {
        this.data.push(item);
    }

    removeItem(item: T): void {
        this.data.splice(this.data.indexOf(item), 1);
    }

    getItems() {
        return [...this.data];
    }
}

const textStorage = new DataStorage<string>([]);
textStorage.addItem("n");
textStorage.addItem("f");
console.log(textStorage.getItems());
textStorage.removeItem("f");
console.log(textStorage.getItems());

// Generic Utility Types
interface CourseGoal {
    title: string;
    description: string;
    completeUntil: Date;
}

function createCourseGoal(title: string, description: string, completeUntil: Date): CourseGoal {
    let courseGoal: Partial<CourseGoal> = {};
    courseGoal.title = title;
    courseGoal.description = description;
    courseGoal.completeUntil = completeUntil;
    return courseGoal as CourseGoal;
}

const persons: Readonly<string[]> = ["Max", "Anna"];
