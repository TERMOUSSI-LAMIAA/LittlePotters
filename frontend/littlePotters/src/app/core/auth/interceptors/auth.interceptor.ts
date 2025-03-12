import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError,  throwError } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  let token = null;

  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('auth_token');
  }

  console.log('Token:', token); 
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Request with token:', cloned); 

    return next(cloned).pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          if (isPlatformBrowser(platformId)) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('currentUser');
            //TODO:remove the role also
          }
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};