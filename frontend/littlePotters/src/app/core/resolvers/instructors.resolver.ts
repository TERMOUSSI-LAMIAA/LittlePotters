import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class InstructorsResolver implements Resolve<any> {

    constructor(private userService: UserService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const page = route.queryParams['page'] ? parseInt(route.queryParams['page']) : 0;
        const size = route.queryParams['size'] ? parseInt(route.queryParams['size']) : 6;

        return this.userService.getInstructorsWithPage(page, size).pipe(
            catchError(error => {
                console.error('Error loading instructors:', error);
                return of(null);
            })
        );
    }
}
