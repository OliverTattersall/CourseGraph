import { Injectable } from '@angular/core';
import { Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  courses: Course [] = [];
  constructor() {
    this.courses.push( new Course(2, "Course 1", []));
    this.courses.push( new Course(3, "Course 2", [2]));
    this.courses.push( new Course(4, "Course 4", [2,3]));
   }

  getCourses(): Course[] {
    return this.courses;
  }
}
