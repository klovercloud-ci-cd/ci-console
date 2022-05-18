

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';
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

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$(){
    return this._refreshNeeded$;
  }

  getCompanyInfo(companyID: any): Observable<any> {
    return this.http.get(BASE_URL + 'companies/' + companyID , {
      params: { loadRepositories: true, loadApplications: true },
    });
  }

  addRepository(companyID: any,payLoad:any): Observable<any> {
    HTTP_OPTIONS.params = {
      companyUpdateOption: 'APPEND_REPOSITORY'
    };
    let newRepo={
      "repositories": [
        {
          "type": payLoad.type,
          "token": payLoad.token,
          "applications": [
            //     {
            //         "_metedata": {
            //             "name": "SomeApplication"
            //         },
            //         "url": "ssssssssssssssss"
            //     }
          ]
        }
      ]
    }
    // return this.http.post(BASE_URL + 'applications', appPayload, HTTP_OPTIONS);
    return this.http
      .put(BASE_URL + 'companies/' + companyID + '/repositories', newRepo, HTTP_OPTIONS)
      .pipe(
        tap((res: any) => {
          this._refreshNeeded$.next();
          console.log('Response Loggg: ', res);
        }),
        // map(()=>{
        //   this._refreshNeeded$.next();
        // }),
        catchError((error: HttpErrorResponse): Observable<any> => {
          // we expect 404, it's not a failure for us.
          if (error.status === 404) {
            return of(null); // or any other stream like of('') etc.
          }

          // other errors we don't know how to handle and throw them further.
          return throwError(error);
        })
      );
  }

  // addRepository(companyID: any): Observable<any> {
  //   let newRepo=[
  //     {
  //       token:'skd2f1d2f1d2f12dff',
  //       type:'github'
  //     }
  //   ]

  //   return this.http.put(BASE_URL + 'companies/' + companyID + '/repositories',newRepo, {
  //     params: {
  //       companyUpdateOption: 'APPEND_REPOSITORY' },
  //   });
  // }

  getApplicationById(
    appId: string | null,
    repoId: string | null,
    companyId: string | null
  ) {
    HTTP_OPTIONS.params = {
      companyId: companyId,
      repositoryId: repoId,
    };
    return this.http.get(BASE_URL + 'applications/' + appId, HTTP_OPTIONS);
  }

  getBranch(repoType: string, repoId: string |null, repoUrl: string) {
    HTTP_OPTIONS.params = {
      repoId: repoId,
      url: repoUrl,
    };
    return this.http.get(BASE_URL + repoType + '/branches', HTTP_OPTIONS);
  }
  getCommit(repoType:string,repoId:string |null,repoUrl:string,branceName:string){
    HTTP_OPTIONS.params = {
      repoId: repoId,
      url: repoUrl,
      branch: branceName,
    };
    return this.http.get(BASE_URL+repoType+'/commits',HTTP_OPTIONS)
  }
  getProcess(commitId:any) {
    HTTP_OPTIONS.params = {
      commitId: commitId,
    };
    return this.http.get(BASE_URL+'processes',HTTP_OPTIONS)
  }
  /*getfootPrint(processId:any) {
    HTTP_OPTIONS.params = {
      commitId: commitId,
    };
    return this.http.get(BASE_URL+'processes',HTTP_OPTIONS)
  }*/
  getPipeLine (processId:any){
    HTTP_OPTIONS.params = {
      action: 'get_pipeline',
    };
    return this.http.get(BASE_URL+'pipelines/'+processId,HTTP_OPTIONS)
  }
}


