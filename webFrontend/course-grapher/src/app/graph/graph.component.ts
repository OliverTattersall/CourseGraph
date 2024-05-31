import { Component, Input, inject } from '@angular/core';
import mermaid from 'mermaid';
import { CoursesService } from '../courses.service';
import { Course } from '../course';
import { ManagerusersService } from '../managerusers.service';
import { User } from '../user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.css'
})
export class GraphComponent {
	coursesService = inject(CoursesService); 
	userService = inject(ManagerusersService);

	endCourse:string = '';
	

	courseNames:string[] = this.coursesService.getCourseNameList();
	
	htmlString:string = "";
	bindFunctions?: ((el:Element) => any | undefined);
	flowChart: string[] = ["graph LR"];
	stringFlowChart: string = "";
	constructor() {
		this.createFlowchart();
	}
	async onSelectChange(txt:any, el:HTMLElement){
		this.endCourse = txt;
		await this.createFlowchart();
		el.innerHTML = this.htmlString;
		this.bindFunctions?.(el);
	}
	ngOnInit(): void {
		console.log("initing");
		window.nodeCallback = (id:string) => {
			console.log(id);
		}
		mermaid.initialize({
			startOnLoad: true,
			flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'cardinal' },
			securityLevel: 'loose',
	  });
	}
	ngOnChanges(changes:any){
		console.log(changes);
		this.createFlowchart();
	}

	createLogicBlock(connector:string, prerequisites:string[], courseId :string, blockIndex:number) : string{
		let res:string[] = [];
		let blockId:string = "";
		let name:string = "";
		switch(connector){
			case 'or':
				blockId = "id" + courseId + "orBlock" + blockIndex.toString();
				name = "[OR]";
				break;
			case 'and':
				blockId = "id" + courseId + "andBlock" + blockIndex.toString(); 
				name = "[AND]";
				break;
			default:
				throw new Error("Bad logic block name");
		}
		if(prerequisites.length == 0){
			return "";
		}else if(prerequisites.length == 1){
			return "id" + prerequisites[0] + "-->" + "id" + courseId;
		}
		res.push(blockId + name);
		res.push(blockId + "-->" + "id"+courseId);
		for(let i = 0; i < prerequisites.length; ++i){
			res.push("id" + prerequisites[i] + "-->" + blockId);
		}
		return res.join("\n");
	}


	async createFlowchart() {
		this.flowChart = ["graph LR"];
		let courses: Course[] = this.coursesService.getCourses(this.endCourse.replaceAll(' ', ''));
		for(let i:number = 0; i < courses.length; ++i){
			this.flowChart.push("id"+courses[i].id + "[" + courses[i].name + "]"); // create block and attach id
			this.flowChart.push("click id" + courses[i].id + " nodeCallback");
			if(courses[i].taken){
				this.flowChart.push("style id"+courses[i].id + " stroke:#0f0,fill:#0f0");
				continue;
			}

			for(let j:number = 0; j < courses[i].prerequisites.length; ++j){
				this.flowChart.push(this.createLogicBlock('or', courses[i].prerequisites[j], courses[i].id, j)); // use or blocks
			}

			// this.flowChart.push("click id" + courses[i].id + " nodeCallback");
		}
		

		this.stringFlowChart = this.flowChart.join("\n");
		const { svg, bindFunctions } = await mermaid.render('graphDefinition', this.stringFlowChart); // create new graph, rerender it in onSelectChange()
		this.bindFunctions = bindFunctions;
		this.htmlString = svg;
		console.log(this.stringFlowChart);


		// example for flowchart
		// this.flowChart = [
		// 	"graph LR",
		// 	"id1[Start]",
		// 	"id1 --> id2",
		// 	"id2[Ques 0]",
			
		// 	"id1[Start] --> id2[Ques 1]",
		// 	"id2 --> id3[Ques 2] & id4[Ques 3]",
		// 	"id3 & id4 --> id5([Ques 4])",
		// 	"id5 --> id6",
		// 	"id6[Ques 5] --> id7[End]",
		// 	"id6 --> id2",
		// 	"ida23s[Start] --> id10[Ques 1]",
		// ];
	}
}
