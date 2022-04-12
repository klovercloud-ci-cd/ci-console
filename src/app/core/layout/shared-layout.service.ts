import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedLayoutService {
  private toggleState = new Subject();
  public toggleState$ = this.toggleState.asObservable();
  private toggleVal = undefined;
  constructor() {}

  emitData() {
    // @ts-ignore
    this.toggleVal = !this.toggleVal;
    this.toggleState.next(this.toggleVal);
  }
}
