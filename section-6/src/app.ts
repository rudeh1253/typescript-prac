type Admin = {
    name: string;
    privileges: string[];
};

type Employee = {
    name: string;
    startDate: Date;
};

interface ElevatedEmployee extends Employee, Admin {

}

// type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
    name: "Max",
    privileges: ["create-server"],
    startDate: new Date()
}

type Combinable = string | number;
type Numberic = number | boolean;

type Universal = Combinable & Numberic;

function add(a: Combinable, b: Combinable) {
    if (typeof a === "string" || typeof b === "string") {
        return a.toString() + b.toString();
    }
    return a + b;
}

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
    console.log("Name: " + emp.name);
    if ("privileges" in emp) {
        console.log("Privileges: " + emp.privileges); // TypeScript can't conform that this always exists on the argument.
    }
    if ("startDate" in emp) {
        console.log("Start Date: " + emp.startDate);
    }
}

printEmployeeInformation(e1);

class Car {

    drive() {
        console.log("Driving...");
    }
}

class Truck {
    
    drive() {
        console.log("Driving a truck...");
    }

    loadCargo(amount: number) {
        console.log("Loading cargo ..." + amount);
    }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
    vehicle.drive()
    if (vehicle instanceof Truck) {
        vehicle.loadCargo(13)
    }
}

useVehicle(v1);
useVehicle(v2);

interface Bird {
    type: "bird";
    flyingSpeed: number;
}

interface Horse {
    type: "horse"
    runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
    let speed;
    switch (animal.type) {
        case "bird":
            speed = animal.flyingSpeed;
            break;
        case "horse":
            speed = animal.runningSpeed;
            break;
    }
    console.log("Moving with speed: " + speed);
}

moveAnimal({type: "bird", flyingSpeed: 10});

const userInputElement = document.getElementById("user-input")! as HTMLInputElement;

userInputElement.value = "Hi there";

const userInput = "";

const storedData = userInput ?? "DEFAULT";

console.log(storedData);