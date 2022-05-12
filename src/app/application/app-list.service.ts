import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const BASE_URL = 'http://192.168.68.114:4201/api/v1/';

@Injectable({
  providedIn: 'root',
})
export class AppListService {
  constructor(private http: HttpClient) {}

  getUserData() {
    return this.http.get('https://jsonplaceholder.typicode.com/users');
  }
  getRepositoryInfo(): Observable<any> {
    return this.http.get(
      BASE_URL + 'repositories/884bbd77-a1fe-4e4d-8326-e441710782e1',
      {
        params: {
          companyId: 'e2b632b0-6dd3-41f5-b45e-d086466e0323',
          loadApplications: true,
        },
      }
    );
  }
}
