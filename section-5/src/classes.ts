abstract class Department {
    // private name: string = "DEFAULT";
    protected employees: string[] = [];
    protected static year = 2023;

    public constructor(private readonly id: string, private name: string) {
    }

    public addEmployee(employee: string) {
        this.employees.push(employee);
    }

    public static createEmployee(name: string) {
        return {name: name};
    }

    public toString(): string {
        return `Department (${this.name}), Id (${this.id})`;
    }

    public abstract describe(): void;
}

class ITDepartment extends Department {
    private static singleton: ITDepartment = new ITDepartment();

    private constructor() {
        super("1", "IT");
    }

    public static getInstance(): ITDepartment {
        return this.singleton;
    }

    public toString(): string {
        return `IT${super.toString()}`;
    }

    public describe(): void {
        console.log("ITDepartment");
    }
}

class AccountDepartment extends Department {
    private lastReport: string;

    get mostRecentReport() {
        if (this.lastReport) {
            return this.lastReport;
        }
        throw new Error("No report");
    }

    constructor(id: string, private reports: string[]) {
        super(id, "Accounting");
        this.lastReport = reports[0];
    }

    public addEmployee(employee: string): void {
        if (employee === "max") {
            return;
        }
        this.employees.push(employee);
    }

    public addReport(text: string) {
        this.reports.push(text);
        this.lastReport = text;
    }

    public describe(): void {
        console.log("AccountDepartment");
    }
}

const accounting = new AccountDepartment("1", ["Asdf"]);
console.log(accounting.mostRecentReport);

console.log(Department.createEmployee("Max"));

const it = ITDepartment.getInstance();
it.describe();