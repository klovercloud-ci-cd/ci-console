import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WsService {
  public wsData = new Subject();

  constructor() { }

  setWsData(data:any) {
    this.wsData.next(data);
  }
}
