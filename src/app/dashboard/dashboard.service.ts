import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenService} from "../auth/token.service";
import {environment} from "../../environments/environment";

const BASE_URL = environment.v1ApiEndPoint;
const USER_BASE_URL = environment.v1AuthEndpoint;
const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  params: {},
};

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private token: TokenService) { }

  // http://localhost:8085/api/v1/users?action=users_count
  //   Get Total Process Count by Date: <with token>
  // http://localhost:8080/api/v1/processes?operation=countProcessByCompanyIdAndDate&from=2022-06-01&to=2022-06-10
  //   Get Pipeline Dashboard Data by Date: <with token>
  // http://localhost:8080/api/v1/pipelines?action=dashboard_data&from=2022-05-23&to=2022-06-20
  //   Get Pods Dashboard Data: <with token>
  // http://localhost:8080/api/v1/kube_objects?object=pod&action=dashboard_data&agent=abc


  // http://localhost:8080/api/v1/companies/a5a55aa0-6165-4e70-bf3f-4663b3293ec0?action=dashboard_data

  getAppSteps(companyID:String,repoId: String,appURL:String): Observable<any> {
    HTTP_OPTIONS.params = {
      companyId: companyID,
      repositoryId:  repoId,
      url:appURL,
      action: 'GET_PIPELINE_FOR_VALIDATION'
    };
    return this.http.get(`${BASE_URL}pipelines`, HTTP_OPTIONS);
  }

  getAllUsers(): Observable<any>{
    HTTP_OPTIONS.params = {
      action:'users_count'
    };
    return this.http.get(`${USER_BASE_URL}users`, HTTP_OPTIONS);
  }

  getAllWebhook(companyID:string): Observable<any>{
    HTTP_OPTIONS.params = {
      action:'dashboard_data'
    };
    return this.http.get(`${BASE_URL}companies/${companyID}`, HTTP_OPTIONS);
  }

  getAllProcesses(): Observable<any>{
    HTTP_OPTIONS.params = {
      action:'dashboard_data'
    };
    return this.http.get(`${BASE_URL}pipelines`, HTTP_OPTIONS);
  }

  getAllAgents(): Observable<any>{
    HTTP_OPTIONS.params = {
      action:'dashboard_data'
    };
    return this.http.get(`${BASE_URL}agents`, HTTP_OPTIONS);
  }

  // http://localhost:8080/api/v1/kube_objects?object=pod&action=dashboard_data&agent=abc

  getPodsByAgent(agent_name:string): Observable<any>{
    HTTP_OPTIONS.params = {
      object:'pod',
      action:'dashboard_data',
      agent:agent_name
    };
    return this.http.get(`${BASE_URL}kube_objects`, HTTP_OPTIONS);
  }


}
