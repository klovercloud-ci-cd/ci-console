import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
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
export class HeaderService {

  constructor(private http: HttpClient) { }

  getNotification(){
    HTTP_OPTIONS.params = {
      scope:'notification',
      page:0,
      limit:5
    };
      return this.http.get(
        `${BASE_URL}processes_events`,
        HTTP_OPTIONS
      );
  }

  getNextLog(next: string) {
    const removeBaseFromNextLink = next.replace('/api/v1/','')
    return this.http.get(
      BASE_URL+removeBaseFromNextLink,
      HTTP_OPTIONS
    );
  }
}
