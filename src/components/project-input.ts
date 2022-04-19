import { Component } from './base-component';
import { Validatable, validate } from '../util/validation';
import { projectState } from '../state/project-state';
import { autobind } from '../decorators/autobind';

// ProjectInput class
// create class to access dom elements in an OOP way
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input')
    // let's get access to the different inputs of the form and store them as props of this class
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
    // call listener
    this.configure();
  }

  configure() {
    // the first arg of bind method declares what the 'this' keyword will refer to 
    // inside the to be executed function, method submitHandler in our case
    this.element.addEventListener('submit', this.submitHandler)
  }

  renderContent() { };

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
  @autobind
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
}
