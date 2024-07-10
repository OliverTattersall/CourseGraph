import { Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, map,distinctUntilChanged,switchMap,tap } from "rxjs/operators";
import { ClosebuttonComponent } from '../closebutton/closebutton.component';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})
export class AutocompleteComponent {
    @Input({required: true}) acceptValues : string[] = [];
    @Input({required: true}) title: string = '';
    @ViewChild('autoCompleteSearchInput') searchInput: ElementRef;
    @ViewChild('autoCompleteWrapper') autoCompleteWrapper: ElementRef;
    @Output() setValueEvent = new EventEmitter<string>(false);
    showSearches: boolean = false;
    isSearching:boolean = false;
    showDropdown:boolean = true;
    searchedValues: any = [];


    ngAfterViewInit(){ // make sure viewchild is initialized
        // console.log(this.searchInput);
        this.addListeneres(); 

    }

    

    addListeneres() {
        // fromEvent(this.autoCompleteWrapper.nativeElement, 'focusout').subscribe(() => {
        //     this.showDropdown = false;
        //     // console.log("here");
        // });
        // fromEvent(this.autoCompleteWrapper.nativeElement, 'focusin').subscribe(() => {this.showDropdown = true;})
        // fromEvent(this.autoCompleteWrapper.nativeElement, 'click').subscribe(() => {

        //     this.searchInput.nativeElement.focus();
        // })

        // Adding keyup Event Listerner on input field
        const search$ = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
            map((event: any) => event.target.value),
            debounceTime(50),   // delay for more efficient API reference
            distinctUntilChanged(),
            tap(()=> this.isSearching = true),
            switchMap((term) => term ? this.getValues(term) : of<any>(this.acceptValues)),
            tap(() => {
                this.isSearching = false,
                this.showSearches = true;
            }));
  
        
        search$.subscribe(data => {
          this.isSearching = false
          this.searchedValues = data;
          if(data.length == this.acceptValues.length){
            this.showDropdown = false;
          }else{
            this.showDropdown = true;
          }
        //   console.log(data);
        })
    }

    getValues(name: string): Observable<any> {
        //Here we perform the simple call to filter function. You can also call to API here for the desired result.
        return of(this.filterValues(name)) //used `of` to convert array to Observable
    }
     
    filterValues(name: string) {
        return this.acceptValues.filter((val) => val.toLowerCase().includes(name.toLowerCase()) == true )
    }

    trackById(index:any,item:any):void{
        return item._id;
    }

    setValueName(value: string){
        console.log(value);
        this.setValueEvent.emit(value);

    }

}
