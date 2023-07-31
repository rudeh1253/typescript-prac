import { autobind as Autobind } from "../decorators/autobind-decorator";
import { projectState } from "../state/project-state";
import * as Validation from "../util/validation";
import Component from "./base-component";

// ProjectInput class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

        const titleValidatable: Validation.Validatable = {
            value: enteredTitle,
            required: true,
        };

        const descriptionValidatable: Validation.Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        };

        const peopleValidatable: Validation.Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5,
        };

        if (
            !Validation.validate(titleValidatable) ||
            !Validation.validate(descriptionValidatable) ||
            !Validation.validate(peopleValidatable)
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

    @Autobind
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
