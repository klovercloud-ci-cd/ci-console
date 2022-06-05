import { Injectable } from '@angular/core';
import  { HttpClient } from '@angular/common/http';
import  { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.v1AuthEndpoint;
@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  constructor(private http: HttpClient) {}

  getUserInfo(userid: any): Observable<any> {
    return this.http.get(`${BASE_URL  }users/${  userid}`);
  }
}
