import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-closebutton',
  standalone: true,
  imports: [],
  templateUrl: './closebutton.component.html',
  styleUrl: './closebutton.component.css'
})
export class ClosebuttonComponent {
    @Input({required:true}) closeAction : (...args: any[]) => any;
    @Output() emiter: EventEmitter<any> = new EventEmitter<any>();

    onClick(){
        this.emiter.emit(this.closeAction());
    }

}
