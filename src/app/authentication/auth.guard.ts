import { CanActivateFn, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const afs = inject(AngularFireAuth);
  const router = inject(Router)

  return afs.authState.pipe(
    map(user => {
      if (user) {
        return true;
      }
      else {
        router.navigate(['/auth']);
        return false;
      }
    })
  )

};
