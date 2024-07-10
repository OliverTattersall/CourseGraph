export class User {
    coursesTaken: string[];
    degree: string = "";
    level: string = "";
    registered: boolean = false;

    constructor(coursesTaken : string[], degree:string = ""){
        this.coursesTaken = coursesTaken;
        this.degree = degree;
    }
}
