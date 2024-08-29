// import { CanActivateFn, Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { inject } from '@angular/core';
// import { map } from 'rxjs';

// export const authGuard: CanActivateFn = (route, state) => {
//   const afs = inject(AngularFireAuth);
//   const router = inject(Router)

//   return afs.authState.pipe(
//     map(user => {
//       if (user) {
//         return true;
//       }
//       else {
//         router.navigate(['/auth']);
//         return false;
//       }
//     })
//   )

// };

import { CanActivateFn, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { inject } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(AngularFireAuth);
  const router = inject(Router);

  return afAuth.authState.pipe(
    switchMap(user => {
      if (user) {
        return afAuth.idTokenResult;
      } else {
        router.navigate(['/auth']);
        return of(null); // No user, return null to indicate navigation to auth page
      }
    }),
    map(idTokenResult => {
      if (idTokenResult) {
        const claims = idTokenResult.claims;
        const userRole = claims['role'];
        const carerId = claims['user_id'];
        const requestedId = route.paramMap.get('id');

        if (userRole === 'admin') {
          // Admin has access to all routes
          return true;
        } else if (userRole === 'carer') {
          // Carer can only access their own route
          if (requestedId === carerId && route.url[0]?.path === 'carers') {
            return true;
          } else {
            // Redirect carer to their specific route
            router.navigate([`/carers/${carerId}`]);
            return false;
          }
        } else {
          // Unauthorized role, redirect to unauthorized page
          router.navigate(['/unauthorized']);
          return false;
        }
      } else {
        // If no ID token result, redirect to auth
        router.navigate(['/auth']);
        return false;
      }
    })
  );
};
