import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const BASE_URL = 'http://192.168.68.114:4200/api/v1/';
@Injectable({
  providedIn: 'root',
})
export class RepoServiceService {
  constructor(public http: HttpClient) {}
  getCompanyInfo(): Observable<any> {
    return this.http.get(BASE_URL + 'companies');
  }
  // getCompanyInfo() {
  //   return this.http.get('https://jsonplaceholder.typicode.com/users');
  // }
}
