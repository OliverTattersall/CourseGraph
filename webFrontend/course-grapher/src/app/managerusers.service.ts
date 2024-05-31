import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class ManagerusersService {
  curUser:User = new User(["PHYS122", "AMATH271", "MATH138", "PHYS249", "PHYS234"]);
  constructor() { 
  }

  updateUser(newUser:User):void{

  }

  getCurrentUser():User{
    return this.curUser;
  }

  // given a string of prereqs, finds the first course the user has taken in the prereq array
  findTakenCoursesInPrereqs(prereqArr: string[]): string {
    for(let i = 0; i < this.curUser.coursesTaken.length; ++i){
      if(prereqArr.includes(this.curUser.coursesTaken[i])){
        console.log(this.curUser.coursesTaken[i]);
        return this.curUser.coursesTaken[i];
      }
    }

    return "";
  }

}
