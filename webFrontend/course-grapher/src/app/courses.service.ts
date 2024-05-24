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
    this.courses.push( new Course("MATH138", "MATH 138", [["MATH116","MATH117", "MATH127","MATH137", "MATH147"]]));
    this.courses.push( new Course("PHYS122", "PHYS 122", [["PHYS111", "PHYS115", "PHYS121", "ECE105"], ["MATH127", "MATH137", "MATH147"]]));
    this.courses.push( new Course("PHYS249", "PHYS 249", [["CS114", "CS116", "CS136", "CS146"]]));
    this.courses.push( new Course("PHYS242", "PHYS 242", [["PHYS112", "PHYS122"], ["MATH128", "MATH138", "MATH148"], ["MATH227", "AMATH231"]]));
    this.courses.push( new Course("PHYS234", "PHYS 234", [["PHYS112","PHYS122"], ["PHYS249", "MATH136", "MATH114"], ["MATH128", "MATH138", "MATH148"], ["MATH228", "AMATH250", "AMATH251"]])); 
    this.courses.push( new Course("AMATH271", "AMATH 271", [["MATH128","MATH138","MATH148"], ["PHYS121"], ["AMATH250", "AMATH251", "MATH228"], ["MATH227", "MATH237", "MATH247"]]));
    this.courses.push( new Course("PHYS349", "PHYS 349", [["PHYS234"], ["PHYS249"], ["PHYS242"], ["AMATH271", "PHYS263"]]));
   }

  getCourses(endCourseId:string): Course[] {
    return this.courses;
  }

  

}
