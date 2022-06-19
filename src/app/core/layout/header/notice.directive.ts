import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[kcciNotice]'
})
export class NoticeDirective {

  constructor() { }
  @HostListener("click", ["$event"])
  onClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    return false;
  }

}
