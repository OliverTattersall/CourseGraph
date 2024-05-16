export class Course {
    prerequisites: number[] = [];
    id: number;
    name: string | undefined;


    constructor(id:number, name:string, prerequisites: number[]){
        this.id = id;
        this.name = name; 
        this.prerequisites = prerequisites;
    }

}
