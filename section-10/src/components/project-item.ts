import { autobind } from "../decorators/autobind-decorator.js";
import { Draggable } from "../models/drag-drop.js";
import { Project } from "../models/project.js";
import Component from "./base-component.js";

// ProejctItem class
export class ProjectItem
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