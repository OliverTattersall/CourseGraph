import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GraphComponent } from './graph/graph.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GraphComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'course-grapher';
  courses:string[] = ["PHYS 349", "PHYS 249"];
  selectedCourse: string = '';
  onChange(txt:any){
    console.log(txt);
    this.selectedCourse = txt;
  }
}
