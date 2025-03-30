import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.Service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.CheckAuth().pipe(
    map(isLoggedIn => {
      if(isLoggedIn) {
        return true
      }
      else {
        router.navigate(['/login']);
        return false;
      }
    })
  )
};


