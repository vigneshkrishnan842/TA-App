import { Directive, ElementRef, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector:'[appDropdown]'
})
export class DropdownDirective{
    @HostBinding('class.open') isOpen=false;
    constructor(private elRef:ElementRef){}
    //@HostListener('click') toggleopen(){
        //To close the dropdown on clicking anywhere in the document
    @HostListener('document:click', ['$event']) toggleOpen(event: Event){
    //this.isOpen=!this.isOpen;
        this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
    }
    
}