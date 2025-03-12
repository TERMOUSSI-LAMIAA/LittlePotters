import {  HttpInterceptorFn } from '@angular/common/http';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error) => {
            console.error('Error occurred:', error);
            return throwError(() => error);
        })
    );
};