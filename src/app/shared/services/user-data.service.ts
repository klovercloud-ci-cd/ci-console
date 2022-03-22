import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
const BASE_URL = environment.v1AuthEndpoint;
@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor( private http:HttpClient) {

  }
  getUserInfo(userid:any){
    return this.http.get(BASE_URL+'users/'+userid)
  }
}
