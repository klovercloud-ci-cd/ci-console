import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from '../../environments/environment';
import { TokenService } from '../auth/token.service';

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
  constructor(
    private http: HttpClient,
    private location: Location,
    private token: TokenService
  ) {}

  socket: any;

  connectToSocket(id?: any) {
    let login_time = localStorage.getItem('loginTime');
    const BASE_URL_WS = environment.v1ApiEndPointWS;
    const socket = new WebSocket(
      `${BASE_URL_WS}pipelines/ws?token=${this.token.getAccessToken()}&from=${login_time}`
    );

    socket.onopen = (e: any) => {
      console.log('Connected');
    };
    return socket;
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
}
