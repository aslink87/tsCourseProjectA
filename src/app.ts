// Project Type
// let's define the type for a project so we don't have to assign any[] type
// we will use a class, not an interface, so that it can be enstantiated

// use an enum to idnetify a project status so that projects can be separated on the DOM according to status
enum ProjectStatus { Active, Finished }


class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) { }
}

// Project State Mgmt

type Listener = (items: Project[]) => void;

class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {

  }

  // return an initial instance with singleton constructor
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

// create global instance of ProjectState
const projectState = ProjectState.getInstance();


// Validation

// interface to define structure of an object, only require 'value'
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  // min & max to check value of number, not string
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    // required input is not empty
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  // check minLength and include typguard to exclude numbers
  // '!= null' allows us to run this step against 0 values
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (validatableInput.min != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (validatableInput.max != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}

// ProjectList class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    this.assignedProjects = [];

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLElement;
    // add element id to attach css formatting
    this.element.id = `${this.type}-projects`;

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem)
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }

  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
}

// ProjectInput class
// create class to access dom elements in an OOP way
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    // import content of template element, then render to Dom
    const importedNode = document.importNode(this.templateElement.content, true);
    // take the above const only available in the constructor, also a DocumentFragment
    // access the concrete HTML element in it and stre in a property 'element'
    this.element = importedNode.firstElementChild as HTMLFormElement;
    // add element id to attach css formatting
    this.element.id = 'user-input';

    // let's get access to the different inputs of the form and store them as props of this class
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    // call listener
    this.configure();

    // call attach method to insert element into app div
    this.attach();
  }

  // validate user input, we use a tuple to validate the 3 form element values
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5
    };
    // validate each input seperately, fail if any = false
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invalid input');
      // should throw error here and implement error handling
      // to be simple we will just return to continue,
      // for that to work we need to add '| void' above as return type as well as tuple
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople]
    }
  }

  // clear inputs
  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  // bind listener to event
  private submitHandler(event: Event) {
    // access and validate inputs
    event.preventDefault();
    //console.log(this.titleInputElement.value);
    const userInput = this.gatherUserInput();
    // check it userInput is tuple
    // tuple doesn't exist as a type in JS, it's simply and Array
    // so we can verify if the userInput is an Array
    if (Array.isArray(userInput)) {
      // destructure userInput
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }

  // add listener to form
  private configure() {
    // the first arg of bind method declares what the 'this' keyword will refer to 
    // inside the to be executed function, method submitHandler in our case

    this.element.addEventListener('submit', this.submitHandler.bind(this))
  }
  // now we have imported node of type DocumentFragment, now let's use it to render content
  // we doing this in a new method to detach the rendering logic from the selection logic above
  private attach() {
    // insert form stored in 'element' prop after the opening tag in app div
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
