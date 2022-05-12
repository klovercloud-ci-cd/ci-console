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

  getRepositoryInfo(companyID: any, repoId: any): Observable<any> {
    return this.http.get(BASE_URL + 'repositories/' + repoId, {
      params: {
        companyId: companyID,
        loadApplications: true,
      },
    });
  }
}
