import { Component, inject, Input } from '@angular/core';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { ClosebuttonComponent } from '../closebutton/closebutton.component';
import Jsondata from '../data/courses.json';
import { ManagerusersService } from '../managerusers.service';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-register-info-page',
  standalone: true,
  imports: [AutocompleteComponent, ClosebuttonComponent],
  templateUrl: './register-info-page.component.html',
  styleUrl: './register-info-page.component.css'
})
export class RegisterInfoPageComponent {
    userService = inject(ManagerusersService); 
    courseService = inject(CoursesService);
    @Input({required:true}) finishFunction: (...args: any[])=> void;
    // data:string[] = ["MATH239", "CS135", "CS241"]; // fix this 
    // data:string[] = Object.values(Jsondata).map((val) => val.faculty + val.classNumber ); // removed space from middle, get this from course service
    data:string[] = this.courseService.getCourseNameList();
    title:string = "course";
    // addedCourses: string[] = [];
    addedCourses: Set<string> = new Set<string>(this.userService.getCurUserCourses());
    

    handleAutoCompleteEvent(course:string){
        // console.log(Jsondata);
        console.log(course);
        // this.addedCourses.push(course);
        this.addedCourses.add(course);
    }

  
    removeCourseFromListFunction(course:string): () => string {
        // let addedCourses = this.addedCourses;
        // console.log(course);
        function pickCourse():string {
            return course;
        }
        return pickCourse;
    }

    removeCourseFromList(course:string){
        // this.addedCourses = this.addedCourses.filter((val:string) => (val != course));
        this.addedCourses.delete(course);
    }

    async submitInfo(){
        await this.userService.updateUserCourses(Array.from(this.addedCourses));
        console.log("updated info");
        console.log(await this.userService.getCurrentUser());
        this.finishFunction();
    }

}
