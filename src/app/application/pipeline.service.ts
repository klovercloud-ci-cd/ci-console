import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from '../../environments/environment';
import { TokenService } from '../auth/token.service';
import {tap} from "rxjs/operators";
import {catchError, Observable, throwError, of} from "rxjs";

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: {},
};
const BASE_URL = environment.v1ApiEndPoint;
const BASE_URL_WS = environment.v1ApiEndPointWS;

@Injectable({
  providedIn: 'root',
})
export class PipelineService {
  private footMarkCredentials: any = [];
  constructor(
    private http: HttpClient,
    private location: Location,
    private token: TokenService
  ) {}

  public observableFootmark$: Observable<any>[]=[];

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      // @ts-ignore
      return throwError('An Error occurred: ', error.error.message);
    }
    return throwError(`${error.error.message}`);

    // return throwError('Internal server error!');
  }

  socket: any;

  connectToSocket(id?: any) {
    let login_time = localStorage.getItem('loginTime');
    const BASE_URL_WS = environment.v1ApiEndPointWS;
    const socket = new WebSocket(
      `${BASE_URL_WS}pipelines/ws?token=${this.token.getAccessToken()}&from=${login_time}`
    );

    // socket.onopen = (e: any) => {
    //   console.log('Connected');
    // };
    return socket;
  }

  triggerProcess(payload:any, type:string, appId:string) {
    console.log("payload,type",payload,type)
    HTTP_OPTIONS.params = {
      appId:appId
    };
    return this.http.post(`${BASE_URL}${type}`,payload, HTTP_OPTIONS)
      .pipe(
        tap((res: any) => {
          console.log('Process Triggered');
        }),
        catchError(this.handleError)
      );
  }

  getBranch(repoType: string, repoId: string | null, repoUrl: string) {
    HTTP_OPTIONS.params = {
      repoId,
      url: repoUrl,
    };
    return this.http.get(`${BASE_URL + repoType}/branches`, HTTP_OPTIONS);
  }

  getStepDetails(stepName:string,processId:string){
    HTTP_OPTIONS.params = {
      step:stepName
    };
    return this.http.get(`${BASE_URL}processes/${processId}/process_life_cycle_events`, HTTP_OPTIONS);
  }

  setProcessId(processId:any){
    this.footMarkCredentials.processId = processId;
  }
  setStepName(stepName:any){
    this.footMarkCredentials.stepName = stepName;
  }
  setClaim(claim:any){
    this.footMarkCredentials.claim = claim;
  }
  getFootMarksCredentials(){
    return this.footMarkCredentials;
  }


}
