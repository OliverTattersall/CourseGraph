export class Course {
    prerequisites: string[][] = []; // note this ordermatters for design of flowcharts
        // perhaps we add a caveat that each one should be sorted alphabetically?
    id: string;
    name: string | undefined;
    taken: boolean = false;


    constructor(id:string, name:string, prerequisites: string[][], taken:boolean = false){
        this.id = id;
        this.name = name; 
        this.prerequisites = prerequisites;
        this.taken = taken;
    }

}
