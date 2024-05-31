export class User {
    coursesTaken: string[];
    degree: string = "";
    level: string = "";

    constructor(coursesTaken : string[], degree:string = ""){
        this.coursesTaken = coursesTaken;
        this.degree = degree;
    }
}
