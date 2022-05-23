import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
interface TitleInterface {
  title: string
}
@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  private data = new BehaviorSubject<TitleInterface>({title: ''});
  currentData = this.data.asObservable();
  // public appOnboardSource = new BehaviorSubject(false);

  constructor() { }

  changeData(data: TitleInterface) {
    this.data.next(data);
  }
/*  changeIfAppOnBord(data: boolean) {
    this.appOnboardSource.next(data);
  }*/
}
