import {Injectable, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UserDataService} from "./user-data.service";
import {AuthService} from "../../auth/auth.service";
import { TokenService } from '../../auth/token.service';


@Injectable({
  providedIn: 'root'
})
export class ResourcePermissionService{
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private userInfo: UserDataService,
    private tokenService: TokenService) {}

  user: any = this.auth.getUserData();
  userPersonalInfo: any;

  getResourcePermissions(){
    // @ts-ignore
    let obj =  JSON.parse(atob(localStorage.getItem("access_token").split('.')[1]))
    let resourcePermissions= new  Map( );
    for (let i = 0; i <  obj.data.resources.length; i++) {
      let permission=new Set();
      for (let j = 0; j <  obj.data.resources[i]["roles"].length; j++) {
        for (let k=0;k<obj.data.resources[i]["roles"][j]["permissions"].length;k++){
          permission.add(obj.data.resources[i]["roles"][j]["permissions"][k]["name"])
        }
      }
      resourcePermissions.set(obj.data.resources[i]["name"], [...permission])
    }
    return resourcePermissions
  }

  authorizedUser(resource:string,permission:string) {
    for (let i = 0; i <  this.getResourcePermissions().get(resource).length; i++) {
      if (this.getResourcePermissions().get(resource)[i]==permission){
        return true
      }
    }
  return false
  }
}
