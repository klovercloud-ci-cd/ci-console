import { Injectable } from '@angular/core';
import  {
  HttpClient,
  HttpErrorResponse} from '@angular/common/http';
import {
  HttpHeaders,
} from '@angular/common/http';
import  { Router } from '@angular/router';
import  { Observable} from 'rxjs';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {TokenService} from "../auth/token.service";

const BASE_URL = environment.v1ApiEndPoint;
const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: {},
};

@Injectable({
  providedIn: 'root'
})
export class LighthouseService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) { }

  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An Error occurred: ', error.error.message);
    } else {
      console.error(
        `Error Code From Backend: ${error.status}`,
        `Body: ${error.error}`
      );
    }
    return throwError(error);
  }

  getAfterAgents(processId:string,agentName:string): Observable<any> {
    HTTP_OPTIONS.params = {
      processId: processId
    };

    return this.http
      .get(`${BASE_URL}agents/${agentName}/k8sobjs`, HTTP_OPTIONS)
      .pipe(
        tap((res: any) => {
          // console.log('Response Log: ');
        }),
        catchError(LighthouseService.handleError)
      );
  }

  getPods(processId:string,agentName:string,typeName:string,typeId:string): Observable<any> {
    HTTP_OPTIONS.params = {
      processId: processId
    };

    return this.http
      .get(`${BASE_URL}agents/${agentName}/${typeName}/${typeId}/pods`, HTTP_OPTIONS)
      .pipe(
        tap((res: any) => {
          // console.log('Response Log: ');
        }),
        catchError(LighthouseService.handleError)
      );
  }

  // http://localhost:8080/api/v1/kube_objects?action=get_by_id&object=config-map&id=1729408a-c872-49c3-81f4-8e9be3b69157&agent=test_agent&processId=abc123

  getDetails(processId:string,agentName:string,typeName:string,typeId:string): Observable<any> {
    HTTP_OPTIONS.params = {
      processId: processId,
      action: 'get_by_id',
      object:'',
      id:typeId,
      agent:agentName,
    };

    return this.http
      .get(`${BASE_URL}kube_objects`, HTTP_OPTIONS)
      .pipe(
        tap((res: any) => {
          // console.log('Response Log: ');
        }),
        catchError(LighthouseService.handleError)
      );
  }

}
