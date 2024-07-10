import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { GraphComponent } from './graph/graph.component';
import { FormsModule } from '@angular/forms';
import { ManagerusersService } from './managerusers.service';
import { User } from './user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    GraphComponent, 
    FormsModule, 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  router = inject(Router);
  userService = inject(ManagerusersService); 
  title = 'course-grapher';
  user: User;
  constructor(){
    this.user = this.userService.getCurrentUser() as User;
  }
  signOut(){
    this.userService.signOut();
    this.router.navigate(['/login']);
  } // delete this 
}
