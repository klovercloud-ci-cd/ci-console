import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  private toggleState = new Subject();

  public toggleState$ = this.toggleState.asObservable();

  private keyValue = {};

  constructor() {}

  emitData(stepname:any,key:any,replaceValue:any) {
    // @ts-ignore
    this.keyValue = {stepname,key,replaceValue};
    // console.log("this.keyValue",this.keyValue)
    this.toggleState.next(this.keyValue);
  }
}
