const person: {
    name: string;
    age: number;
    hobbies: string[];
    role: [number, string];
} = {
    name: "Maximilian",
    age: 30,
    hobbies: ["Sports", "Cooking"],
    role: [2, 'author']
};

person.role.push("admin");

let persons: {name: string, age: number, hobbies: string[]}[];
persons = [
    {
        name: "hi",
        age: 15,
        hobbies: ["H", "B"]
    }
];

console.log(person);