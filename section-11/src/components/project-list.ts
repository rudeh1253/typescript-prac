import { autobind } from "../decorators/autobind-decorator";
import { DragTarget } from "../models/drag-drop";
import { Project, ProjectStatus } from "../models/project";
import { projectState } from "../state/project-state";
import Component from "./base-component";
import { ProjectItem } from "./project-item";

// ProjectList class
export class ProjectList
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
