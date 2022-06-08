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
    const companyId = id;
    const BASE_URL_WS = environment.v1ApiEndPointWS;
    const socket = new WebSocket(
      `${BASE_URL_WS}pipelines/ws?token=${this.token.getAccessToken()}`
    );
    socket.onopen = (e: any) => {
      console.log('Connected');
      // console.log(this.location.path());
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
}
