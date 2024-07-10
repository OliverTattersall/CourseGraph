import { Component } from '@angular/core';
import { GraphComponent } from '../graph/graph.component';

@Component({
  selector: 'app-graph-page',
  standalone: true,
  imports: [GraphComponent],
  templateUrl: './graph-page.component.html',
  styleUrl: './graph-page.component.css'
})
export class GraphPageComponent {

}
