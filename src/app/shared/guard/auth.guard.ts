import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import {SharedSnackbarService} from "../snackbar/shared-snackbar.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private route: Router,private snackBar:SharedSnackbarService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.auth.isLogin()) {
      return true;
    } else {
      this.route.navigate(['auth/login']).then((navigated: boolean) => {
        if(navigated) {
          this.snackBar.openSnackBar('Please Login!','You Dont Have access to this page! Please Login', 'sb-warn');
        }
      });
      return false;
    }
  }
}
