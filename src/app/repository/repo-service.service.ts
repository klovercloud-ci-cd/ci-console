import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject, catchError, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: {},
};
const BASE_URL = environment.v1ApiEndPoint;

@Injectable({
  providedIn: 'root',
})
export class RepoServiceService {
  constructor(private http: HttpClient) {}

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  getCompanyInfo(companyID: any): Observable<any> {
    return this.http.get(`${BASE_URL}companies/${companyID}`, {
      params: { loadRepositories: true, loadApplications: true },
    });
  }

  addRepository(companyID: any, payLoad: any): Observable<any> {
    HTTP_OPTIONS.params = {
      companyUpdateOption: 'APPEND_REPOSITORY',
    };
    const newRepo = {
      repositories: [
        {
          type: payLoad.type,
          token: payLoad.token,
          applications: [],
        },
      ],
    };
    return this.http
      .put(
        `${BASE_URL}companies/${companyID}/repositories`,
        newRepo,
        HTTP_OPTIONS
      )
      .pipe(
        tap((res: any) => {
          this._refreshNeeded$.next();
        }),
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

  getApplicationById(
    appId: string | null,
    repoId: string | null,
    companyId: string | null
  ) {
    HTTP_OPTIONS.params = {
      companyId,
      repositoryId: repoId,
    };
    return this.http.get(`${BASE_URL}applications/${appId}`, HTTP_OPTIONS);
  }

  getCommit(
    repoType: string,
    repoId: string | null,
    repoUrl: string,
    branchName: string,
    page:number ,
    limit: number
  ) {
    HTTP_OPTIONS.params = {
      repoId: repoId,
      url: repoUrl,
      branch: branchName,
      page:page,
      limit:limit
    };
    console.log("LOGS:",   BASE_URL + repoType,'/commits',   repoId,      repoUrl,      branchName,      page,      limit)
    return this.http.get(`${BASE_URL + repoType}/commits`, HTTP_OPTIONS);
  }

  getPrevNextCommit(repoType: string, repoId: string | null, repoUrl: string, branchName:any,page:number , limit: number){
    HTTP_OPTIONS.params = {
      repoId: repoId,
      url: repoUrl,
      branch: branchName,
      page:page,
      limit:limit
    };

    console.log("LOGS:2",      repoId,      repoUrl,      branchName,      page,      limit)
    return this.http.get(`${BASE_URL + repoType}/commits`, HTTP_OPTIONS);
  }


  // getNextCommit(link:any){
  //   HTTP_OPTIONS.params = {
  //     repoId: repoId,
  //     url: repoUrl,
  //     branch: branchName,
  //     page:page,
  //     limit:limit
  //   };
  //   return this.http.get(`${BASE_URL + repoType}/commits`, HTTP_OPTIONS);
  // }

  // getNextCommit(next: string, repoID:string | null, repoUrl:string, branch:string) {
  //   console.log("NEXT:",next)
  //   HTTP_OPTIONS.params = {
  //     repoId : repoID,
  //     url: repoUrl,
  //     branch: branch,
  //   };
  //   const removeBaseFromNextLink = next.replace('/api/v1/','')
  //   return this.http.get(
  //     BASE_URL+removeBaseFromNextLink,
  //     HTTP_OPTIONS
  //   );
  // }

  getPrevCommit(prev: string, repoID:string | null, repoUrl:string, branch:string) {
    console.log("PREV:",prev)
    HTTP_OPTIONS.params = {
      repoId : repoID,
      url: repoUrl,
      branch: branch,
    };
    const removeBaseFromNextLink = prev.replace('/api/v1/','')
    return this.http.get(
      BASE_URL+removeBaseFromNextLink,
      HTTP_OPTIONS
    );
  }

  getProcess(commitId: any) {
    HTTP_OPTIONS.params = {
      commitId,
    };
    return this.http.get(`${BASE_URL}processes`, HTTP_OPTIONS);
  }

  getfootPrint(processId: any, stepName: any) {
    return this.http.get(
      `${BASE_URL}processes/${processId}/steps/${stepName}/footmarks`,
      HTTP_OPTIONS
    );
  }

  getPipeLine(processId: any) {
    HTTP_OPTIONS.params = {
      action: 'get_pipeline',
    };
    return this.http.get(`${BASE_URL}pipelines/${processId}`, HTTP_OPTIONS);
  }

  getFootamarkLog(processId: any, stepName: any, footmarkName: any,page:number,limit:number,claim:number) {
    HTTP_OPTIONS.params = {
      claims: claim,
      page:page,
      limit:limit,
      loadApplications:true,
      loadRepositories:true

    };
    return this.http.get(
      `${BASE_URL}processes/${processId}/steps/${stepName}/footmarks/${footmarkName}/logs`,
      HTTP_OPTIONS
    );
  }
}
