import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as endpoints from './role.endpoints';

@Injectable()
export class RoleService {
  constructor(private http: HttpClient) {}

  getRoles(): Observable<any> {
    return this.http.get(environment.v1AuthEndpoint + endpoints.ROLES);
  }

  getRole(roleId: string): Observable<any> {
    return this.http.get(
      `${environment.v1AuthEndpoint + endpoints.ROLES}/${roleId}`
    );
  }

  createRole(payload: any): Observable<any> {
    const queryParams = {
      action: 'create_role',
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params: queryParams,
    };
    return this.http.post(
      environment.v1AuthEndpoint + endpoints.ROLES,
      payload,
      httpOptions
    );
  }

  updateRole(roleId: string, payload: any): Observable<any> {
    return this.http.put(
      `${environment.v1AuthEndpoint + endpoints.ROLES}/${roleId}`,
      payload
    );
  }

  deleteRole(role: any): Observable<any> {
    return this.http.delete(
      `${environment.v1AuthEndpoint + endpoints.ROLES}/${role?.name}`
    );
  }

  // Dependencies
  // when dependencies module available it will remove their own module
  getPermissions(): Observable<any> {
    return this.http.get(environment.v1AuthEndpoint + endpoints.PERMISSIONS);
  }
}
