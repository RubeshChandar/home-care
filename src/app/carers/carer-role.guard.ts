import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, take, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarerRoleGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.afAuth.idTokenResult.pipe(
      take(1),
      switchMap(idTokenResult => {

        if (idTokenResult?.claims["role"] === 'admin') {
          return [true];
        }
        if (idTokenResult?.claims["role"] === 'carer') {
          const carerId = idTokenResult.claims["user_id"];
          this.router.navigate([`/carers/${carerId}`]);
          return [true];
        } else {
          // If the user is not a carer, block access and redirect to an unauthorized page
          return [this.router.createUrlTree([''])];
        }
      })
    );
  }
}
