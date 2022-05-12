import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const BASE_URL = 'http://192.168.68.114:4203/api/v1/';
@Injectable({
  providedIn: 'root',
})
export class RepoServiceService {
  constructor(private http: HttpClient) {}

  getCompanyInfo(): Observable<any> {
    return this.http.get(
      BASE_URL + 'companies/e2b632b0-6dd3-41f5-b45e-d086466e0323',
      { params: { loadRepositories: true, loadApplications: true } }
    );
  }
  getApplicationById(appId:string, repoId:string,companyId:string){
    return this.http.get(BASE_URL+'/'+appId)
  }
}
