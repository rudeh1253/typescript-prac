/// <reference path="drag-drop-interfaces.ts" />
/// <reference path="project-model.ts" />

namespace App {

    // Input validation
    interface Validatable {
        value: string | number;
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
    }

    function validate(validatableInput: Validatable): boolean {
        let isValid = true;
        const { value, required, minLength, maxLength, min, max } =
            validatableInput;

        if (required) {
            isValid = isValid && value !== 0;
        }
        if (minLength && typeof value === "string") {
            isValid = isValid && value.length >= minLength;
        }
        if (maxLength && typeof value === "string") {
            isValid = isValid && value.length <= maxLength;
        }
        if (min && typeof value === "number") {
            isValid = isValid && value >= min;
        }
        if (max && typeof value === "number") {
            isValid = isValid && value <= max;
        }
        return isValid;
    }

    // autobind decorator
    function autobind(
        target: any,
        methodName: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        const adjDescriptor: PropertyDescriptor = {
            configurable: true,
            get() {
                const boundFunction = originalMethod.bind(this);
                return boundFunction;
            },
        };
        return adjDescriptor;
    }

    // Component Base Class
    abstract class Component<T extends HTMLElement, U extends HTMLElement> {
        protected templateElement: HTMLTemplateElement;
        protected hostElement: T;
        protected element: U;

        constructor(
            templateId: string,
            hostElementId: string,
            insertAtStart: boolean,
            newElementId?: string
        ) {
            this.templateElement = document.getElementById(
                templateId
            )! as HTMLTemplateElement;
            this.hostElement = document.getElementById(hostElementId)! as T;

            const importNode = document.importNode(
                this.templateElement.content,
                true
            );
            this.element = importNode.firstElementChild as U;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach(insertAtStart);
        }

        private attach(insertAtStart: boolean): void {
            this.hostElement.insertAdjacentElement(
                insertAtStart ? "afterbegin" : "beforeend",
                this.element
            );
        }

        protected abstract configure(): void;
        protected abstract renderContent(): void;
    }

    // ProjectInput class
    class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
        private titleInputElement: HTMLInputElement;
        private descriptionInputElement: HTMLInputElement;
        private peopleInputElement: HTMLInputElement;

        public constructor() {
            super("project-input", "app", true, "user-input");

            this.titleInputElement = this.element.querySelector(
                "#title"
            )! as HTMLInputElement;
            this.descriptionInputElement = this.element.querySelector(
                "#description"
            )! as HTMLInputElement;
            this.peopleInputElement = this.element.querySelector(
                "#people"
            )! as HTMLInputElement;

            this.configure();
        }

        private gatherUserInput(): [string, string, number] | void {
            const enteredTitle = this.titleInputElement.value;
            const enteredDescription = this.descriptionInputElement.value;
            const enteredPeople = this.peopleInputElement.value;

            const titleValidatable: Validatable = {
                value: enteredTitle,
                required: true,
            };

            const descriptionValidatable: Validatable = {
                value: enteredDescription,
                required: true,
                minLength: 5,
            };

            const peopleValidatable: Validatable = {
                value: +enteredPeople,
                required: true,
                min: 1,
                max: 5,
            };

            if (
                !validate(titleValidatable) ||
                !validate(descriptionValidatable) ||
                !validate(peopleValidatable)
            ) {
                alert("Invalid input, please try again!");
                return;
            } else {
                return [enteredTitle, enteredDescription, +enteredPeople];
            }
        }

        private clearInputs() {
            this.titleInputElement.value = "";
            this.descriptionInputElement.value = "";
            this.peopleInputElement.value = "";
        }

        @autobind
        private submitHandler(event: Event) {
            // Trigger an HTTP request to be sent which I don't want
            event.preventDefault();
            const userInput = this.gatherUserInput();

            // Check if userInput is tuple
            if (Array.isArray(userInput)) {
                const [title, desc, people] = userInput;
                projectState.addProject(title, desc, people);
                this.clearInputs();
            }
        }

        protected configure() {
            // submitHandler() method is bound as a event listener.
            // When binding method in event listener, "this" instance inside
            // of the listener method is bound to
            // something else, in this case to the current target of the
            // event. If calling submitHandler.bind() method and passing "this"
            // as an argument, "this" inside of submitHandler points to the
            // same of "this" here.
            // Now, thanks to autobind decorator above, there's no need to
            // call submitHandler.bind(this) here.
            this.element.addEventListener("submit", this.submitHandler);
        }

        protected renderContent(): void {}
    }

    // ProejctItem class
    class ProjectItem
        extends Component<HTMLUListElement, HTMLLIElement>
        implements Draggable
    {
        private project: Project;

        constructor(hostId: string, project: Project) {
            super("single-project", hostId, false, project.id);
            this.project = project;

            this.configure();
            this.renderContent();
        }

        @autobind
        dragStartHandler(event: DragEvent): void {
            // dataTransfer property is special for drag event.
            // On that property, you can attach data to the drag event.
            event.dataTransfer!.setData("text/plain", this.project.id);

            // This constrols how the cursor will look.
            // And tells the browser about our intention that we plan
            // to move an element from A to B. An alternative could be
            // copy, where you then get different cursor which indicates
            // to the user that you are copying and not moving.
            event.dataTransfer!.effectAllowed = "move";
        }

        @autobind
        dragEndHandler(_: DragEvent): void {
            console.log(_);
        }

        public get persons() {
            return this.project.people > 1
                ? `${this.project.people} persons`
                : "1 person";
        }

        protected configure(): void {
            // "dragstart" event is a default browser DOM event able to
            // listen to.
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragend", this.dragEndHandler);
        }

        protected renderContent(): void {
            this.element.querySelector("h2")!.textContent = this.project.title;
            this.element.querySelector("h3")!.textContent =
                this.persons + " assigned";
            this.element.querySelector("p")!.textContent = this.project.description;
        }
    }

    // ProjectList class
    class ProjectList
        extends Component<HTMLDivElement, HTMLElement>
        implements DragTarget
    {
        private assignedProjects: any[];

        constructor(private type: "active" | "finished") {
            super("project-list", "app", false, `${type}-projects`);
            this.assignedProjects = [];

            this.configure();
            this.renderContent();
        }

        @autobind
        dragOverHandler(event: DragEvent): void {
            if (
                event.dataTransfer &&
                event.dataTransfer.types[0] === "text/plain"
            ) {
                // In JavaScript drag and drop works such that a drop is
                // actually only allowed, so that drop event will only
                // trigger on an element. If in the dragOverHandler on
                // the same element, you called preventDefault.
                // The default for JavaScript drag and drop events is to
                // not allow dropping. So you have to prevent default in the
                // dragOverHandler to tell JavaScript and the browser.
                event.preventDefault();

                const listEl = this.element.querySelector("ul")!;
                listEl.classList.add("droppable");
            }
        }

        @autobind
        dropHandler(event: DragEvent): void {
            const prjId = event.dataTransfer!.getData("text/plain");
            projectState.moveProject(
                prjId,
                this.type === "active"
                    ? ProjectStatus.ACTIVE
                    : ProjectStatus.FINISHED
            );
        }

        @autobind
        dragLeaveHandler(_: DragEvent): void {
            const listEl = this.element.querySelector("ul")!;
            listEl.classList.remove("droppable");
        }

        protected configure(): void {
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            this.element.addEventListener("drop", this.dropHandler);
            projectState.addListener((projects: Project[]) => {
                const relevantProjects = projects.filter((prj) => {
                    if (this.type === "active") {
                        return prj.status === ProjectStatus.ACTIVE;
                    } else {
                        return prj.status === ProjectStatus.FINISHED;
                    }
                });
                this.assignedProjects = relevantProjects;
                this.renderProjects();
            });
        }

        protected renderProjects() {
            const listEl = document.getElementById(
                `${this.type}-projects-list`
            )! as HTMLUListElement;
            listEl.innerHTML = "";
            for (const prjItem of this.assignedProjects) {
                new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
            }
        }

        protected renderContent() {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector("ul")!.id = listId;
            this.element.querySelector("h2")!.textContent =
                this.type.toUpperCase() + " PROJECTS";
        }
    }

    // Listener type
    type Listener<T> = (items: T[]) => void;

    // Base State class
    class State<T> {
        protected listeners: Listener<T>[] = [];

        public addListener(listenerFn: Listener<T>) {
            this.listeners.push(listenerFn);
        }
    }

    // Project State Management
    class ProjectState extends State<Project> {
        private projects: Project[] = [];
        private static instance: ProjectState;

        private constructor() {
            super();
        }

        static getInstance() {
            if (this.instance) {
                return this.instance;
            } else {
                this.instance = new ProjectState();
                return this.instance;
            }
        }

        public addProject(title: string, description: string, numOfPeople: number) {
            const newProject = new Project(
                Math.random().toString(),
                title,
                description,
                numOfPeople,
                ProjectStatus.ACTIVE
            );
            this.projects.push(newProject);
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }

        public moveProject(projectId: string, newStatus: ProjectStatus) {
            const project = this.projects.find((prj) => prj.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        }

        private updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
    }

    const projectState = ProjectState.getInstance();

    new ProjectInput();
    new ProjectList("active");
    new ProjectList("finished");
}