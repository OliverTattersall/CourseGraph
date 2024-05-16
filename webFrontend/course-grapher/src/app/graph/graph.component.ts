import { Component, inject } from '@angular/core';
import mermaid from 'mermaid';
import { CoursesService } from '../courses.service';
import { Course } from '../course';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.css'
})
export class GraphComponent {

	coursesService = inject(CoursesService); 
	flowChart: any;
	stringFlowChart: string = "";
	constructor() {
		this.createFlowchart();
	}
	ngOnInit(): void {
		mermaid.initialize({});
	}
	createFlowchart() {
		this.flowChart = ["graph LR"];
		let courses: Course[] = this.coursesService.getCourses();
		for(let i:number = 0; i < courses.length; ++i){
			this.flowChart.push("id"+courses[i].id.toString() + "[" + courses[i].name + "]"); // create block and attach id
			for(let j:number = 0; j < courses[i].prerequisites.length; ++j){
				this.flowChart.push("id" + courses[i].prerequisites[j].toString() + "-->" + "id" + courses[i].id.toString()); // add all prerequisites
			}
		}
		// this.flowChart = [
		// 	"graph LR",
		// 	"id1[Start]",
		// 	"id1 --> id2",
		// 	"id2[Ques 0]",
			
		// 	// "id1[Start] --> id2[Ques 1]",
		// 	"id2 --> id3[Ques 2] & id4[Ques 3]",
		// 	"id3 & id4 --> id5([Ques 4])",
		// 	"id5 --> id6",
		// 	"id6[Ques 5] --> id7[End]",
		// 	"id6 --> id2",
		// 	"ida23s[Start] --> id10[Ques 1]",
		// ];
		this.stringFlowChart = this.flowChart.join("\n");
	}
}
