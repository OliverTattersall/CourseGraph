import { Component, Input, inject } from '@angular/core';
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

	@Input() endCourse:string = '';
	coursesService = inject(CoursesService); 
	flowChart: any;
	stringFlowChart: string = "";
	constructor() {
		this.createFlowchart();
	}
	ngOnInit(): void {
		window.nodeCallback = (id:string) => {
			console.log(id);
		}
		mermaid.initialize({
			startOnLoad: true,
			flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'cardinal' },
			securityLevel: 'loose',
	  });
	}

	createFlowchart() {
		
		this.flowChart = ["graph LR"];
		let courses: Course[] = this.coursesService.getCourses();
		for(let i:number = 0; i < courses.length; ++i){
			this.flowChart.push("id"+courses[i].id + "[" + courses[i].name + "]"); // create block and attach id
			for(let j:number = 0; j < courses[i].prerequisites.length; ++j){
				this.flowChart.push("id" + courses[i].prerequisites[j] + "-->" + "id" + courses[i].id); // add all prerequisites
			}
			this.flowChart.push("click id" + courses[i].id + " nodeCallback");
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
		console.log(this.stringFlowChart);
	}
}
