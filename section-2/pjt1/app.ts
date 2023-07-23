enum Role {
    ADMIN, READ_ONLY, AUTHOR
};

const person: {
    name: string;
    age: number;
    hobbies: string[];
    role: Role;
} = {
    name: "Maximilian",
    age: 30,
    hobbies: ["Sports", "Cooking"],
    role: Role.ADMIN
};

console.log(person);