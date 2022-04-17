// Project Type
// let's define the type for a project so we don't have to assign any[] type
// we will use a class, not an interface, so that it can be enstantiated

// use an enum to idnetify a project status so that projects can be separated on the DOM according to status
export enum ProjectStatus { Active, Finished }

export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) { }
}

