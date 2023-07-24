class Department {
    name: string = "DEFAULT";

    constructor(n: string) {
        this.name = n;
    }
}

console.log(new Department("name").name);