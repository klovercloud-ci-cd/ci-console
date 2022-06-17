import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Location} from "@angular/common";
import {TokenService} from "../auth/token.service";
import {Observable} from "rxjs";

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: {},
};
const BASE_URL = environment.v1ApiEndPoint;

@Injectable({
  providedIn: 'root'
})
export class ProcessLifecycleEventService {

  constructor(
    private http: HttpClient,
    private token: TokenService
  ) {}

  reclaim(processId: any, step: any, stepType: any): Observable<any> {
    let stepStatus =""
    if(stepType=='BUILD'  ){
      stepStatus='non_initialized'
    }else{
      stepStatus='paused'
    }
    return this.http.put(`${BASE_URL}process_life_cycle_events?action=reclaim&step=${step}&processId=${processId}&status=${stepStatus}`, {
    });
  }

}
