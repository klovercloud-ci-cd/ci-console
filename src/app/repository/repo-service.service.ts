import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: {},
};
const BASE_URL = 'http://192.168.68.114:4202/api/v1/';
@Injectable({
  providedIn: 'root',
})

export class RepoServiceService {
  constructor(private http: HttpClient) {}

  getCompanyInfo(companyID: any): Observable<any> {
    return this.http.get(BASE_URL + 'companies/' + companyID, {
      params: { loadRepositories: true, loadApplications: true },
    });
  }
  getApplicationById(appId:string |null, repoId:string |null,companyId:string |null){
    HTTP_OPTIONS.params = {
      companyId: companyId,
      repositoryId: repoId,
    };
    return this.http.get(BASE_URL+'applications/'+appId,HTTP_OPTIONS)
  }

  getBranch(repoType:string,repoId:string,repoUrl:string) {
    HTTP_OPTIONS.params = {
      repoId: repoId,
      url: repoUrl,
    };
    return this.http.get(BASE_URL+repoType+'/branches',HTTP_OPTIONS)
  }
  getCommit(repoType:string,repoId:string,repoUrl:string,branceName:string){
    HTTP_OPTIONS.params = {
      repoId: repoId,
      url: repoUrl,
      branch: branceName,
    };
    return this.http.get(BASE_URL+repoType+'/commits',HTTP_OPTIONS)
  }
}
