import { Injectable, inject } from '@angular/core';
import { Course } from './course';
import { User } from './user';
import { ManagerusersService } from './managerusers.service';
import { Queue } from 'queue-typescript';
import Jsondata from './data/courses.json';

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    courses: {[id:string] : Course} = {};
    userService = inject(ManagerusersService); 
    constructor() {

        // map Json data to courses

        this.courses["PHYS121"] = new Course("PHYS121", "PHYS 121", []);
        this.courses["MATH138"] = new Course("MATH138", "MATH 138", [["MATH116","MATH117", "MATH127","MATH137", "MATH147"]]);
        this.courses["PHYS122"] = new Course("PHYS122", "PHYS 122", [["PHYS111", "PHYS115", "PHYS121", "ECE105"], ["MATH127", "MATH137", "MATH147"]]);
        this.courses["PHYS249"] = new Course("PHYS249", "PHYS 249", [["CS114", "CS116", "CS136", "CS146"]]);
        this.courses["MATH227"] = new Course("MATH227", "MATH 227", [["MATH128", "MATH138"]]);
        this.courses["AMATH231"] = new Course("AMATH231", "AMATH 231", [["MATH237"]]);
        this.courses["PHYS242"] = new Course("PHYS242", "PHYS 242", [["PHYS112", "PHYS122"], ["MATH128", "MATH138", "MATH148"], ["MATH227", "AMATH231"]]);
        this.courses["PHYS234"] = new Course("PHYS234", "PHYS 234", [["PHYS112","PHYS122"], ["PHYS249", "MATH136", "MATH114"], ["MATH128", "MATH138", "MATH148"], ["MATH228", "AMATH250", "AMATH251"]]);
        this.courses["AMATH271"] = new Course("AMATH271", "AMATH 271", [["MATH128","MATH138","MATH148"], ["PHYS121"], ["AMATH250", "AMATH251", "MATH228"], ["MATH227", "MATH237", "MATH247"]]);
        this.courses["PHYS349"] = new Course("PHYS349", "PHYS 349", [["PHYS234"], ["PHYS249"], ["PHYS242"], ["AMATH271", "PHYS263"]]);

    }


    getCourseNameList(): string []{
        return Object.keys(this.courses);
    }

    getCourses(endCourseId:string): Course[] { // could also do user course cleaning here
        if(endCourseId == ''){
            return [];
        }
        let curUser: User|null = this.userService.getCurrentUser();
        console.log(curUser);
        let res : Course[] = [];
        let tempCourses: {[id:string] : Course} = this.courses;

        let courseQueue: Queue<string> = new Queue<string>(endCourseId);
        let courseSet: Set<string> = new Set();
        while(courseQueue.length !=0){
            let curCourse = courseQueue.dequeue();

            if(courseSet.has(curCourse)){
                continue;
            }
            if(!tempCourses[curCourse]){
                courseSet.add(curCourse);
                continue;
            }
            // console.log(tempCourses[curCourse], curCourse);
            if(tempCourses[curCourse].taken || curUser?.coursesTaken.includes(curCourse)){
                console.log(curCourse);
                tempCourses[curCourse].taken = true;
            }else{
                for(let i = 0; i < tempCourses[curCourse].prerequisites.length; ++i){
                    let foundTakenPrereq = this.userService.findTakenCoursesInPrereqs(tempCourses[curCourse].prerequisites[i]);
                    if(foundTakenPrereq){
                        console.log(foundTakenPrereq);
                        tempCourses[curCourse].prerequisites[i] = [foundTakenPrereq];
                        tempCourses[foundTakenPrereq].taken = true;
                    }
                    for(let j = 0; j < tempCourses[curCourse].prerequisites[i].length; ++j){
                        courseQueue.enqueue(tempCourses[curCourse].prerequisites[i][j]);
                    }
                }
            }

            res.push(tempCourses[curCourse]);
            courseSet.add(curCourse);

        }
        // console.log(tempCourses);
        return res;
    }

  

}
