import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { ManagerusersService } from '../managerusers.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
    userService = inject(ManagerusersService);
    editInfo: boolean;
    user:User;
    constructor(private route: ActivatedRoute){
        this.editInfo = true;
        console.log(this.route.queryParams);
        let temp = this.userService.getCurrentUser();
        if(!temp){
            // handle this
        }
        this.user = temp as User;
    }
    

}
