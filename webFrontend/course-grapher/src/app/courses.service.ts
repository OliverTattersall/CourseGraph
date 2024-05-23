import { Injectable } from '@angular/core';
import { Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  courses: Course [] = [];
  constructor() {
    for(let i:number = 5; i < 80; ++i){
      // this.courses.push( new Course(i, "Course " + i,  [Math.floor(i*Math.random())]) );
      // this.courses.push( new Course(i.toString(), "Course " + i, Array.from({length: Math.floor(i*Math.random()/4)}, () => Math.floor(i*Math.random())) ) );
    }
    // this.courses.push( new Course("1", "Course 1", []));
    // this.courses.push( new Course("2", "Course 2", ["1"]));
    // this.courses.push( new Course("3", "Course 3", [1,2]));

    this.courses.push( new Course("PHYS121", "PHYS 121", []));
    this.courses.push( new Course("MATH138", "MATH 138", []));
    this.courses.push( new Course("PHYS122", "PHYS 122", ["PHYS121"]));
    this.courses.push( new Course("PHYS249", "PHYS 249", []));
    this.courses.push( new Course("PHYS234", "PHYS 234", ["PHYS122", "PHYS249", "MATH138"])); 
    this.courses.push( new Course("AMATH271", "AMATH 271", ["MATH138", "PHYS121"]));
    this.courses.push( new Course("PHYS349", "PHYS 349", ["PHYS234", "PHYS249", "AMATH271"]));
   }

  getCourses(endCourseId:string): Course[] {
    return this.courses;
  }

  

}
