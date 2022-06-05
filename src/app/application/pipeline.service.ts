import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from '../../environments/environment';

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
  constructor(private http: HttpClient, private location: Location) {}

  socket: any;

  connectToSocket() {
    const companyId = 'fc88479b-144d-429b-8d1f-eccd79a8eb1d';
    const BASE_URL_WS = environment.v1ApiEndPointWS;
    const socket = new WebSocket(
      `${BASE_URL_WS}pipelines/ws?company_id=${companyId}`
    );
    socket.onopen = (e: any) => {
      console.log('Connected');
      console.log(this.location.path());
    };
    /* socket.onmessage=(e)=>{
       if (e.data !== 't'){
         this.socket = e.data
         console.log(e.data)
         this.setLog(e.data)
       }
     }
     setInterval(()=>{
       socket.send(' ')
     },300) */
    return socket;
  }

  getBranch(repoType: string, repoId: string | null, repoUrl: string) {
    HTTP_OPTIONS.params = {
      repoId,
      url: repoUrl,
    };
    return this.http.get(`${BASE_URL + repoType}/branches`, HTTP_OPTIONS);
  }

  setLog(data: any) {
    this.socket = data;
  }

  getLog() {
    return this.socket;
  }
}
