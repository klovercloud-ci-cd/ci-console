import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  private data = new BehaviorSubject({title: ''});
  currentData = this.data.asObservable();
  public appOnboardSource = new BehaviorSubject(false);

  constructor() { }

  changeData(data: any) {

    this.data.next(data);
  }
/*  changeIfAppOnBord(data: boolean) {
    this.appOnboardSource.next(data);
  }*/
}
