import  { HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as endpoint from './user.endpoints';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(qp: any): Observable<any> {
    const httpOptions = {
      params: {
        status:qp.status
      }
    }
    return this.http.get(environment.v1AuthEndpoint + endpoint.USERS, httpOptions)
  }

  getUser(userId: string): Observable<any> {
    return this.http.get(`${environment.v1AuthEndpoint + endpoint.USERS  }/${  userId}`)
  }

  createUser(payload: any): Observable<any> {
    const queryParams = {
      action: "create_user"
    }
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: queryParams
    }
    return this.http.post(environment.v1AuthEndpoint + endpoint.USERS, payload, httpOptions);
  }

  updateUser(userId: string, payload: any): Observable<any> {
    return this.http.put(`${environment.v1AuthEndpoint + endpoint.USERS  }/${  userId}`, payload)
  }

  deleteUser(user: any): Observable<any> {
    return this.http.delete(`${environment.v1AuthEndpoint + endpoint.USERS  }/${  user?.id}`)
  }

  // Dependencies
  // when dependencies module available it will remove their own module
  getPermission(): Observable<any> {
    return this.http.get(environment.v1AuthEndpoint + endpoint.PERMISSIONS)
  }

  getResources(): Observable<any> {
    return this.http.get(environment.v1AuthEndpoint + endpoint.RESOURCES)
  }
}
