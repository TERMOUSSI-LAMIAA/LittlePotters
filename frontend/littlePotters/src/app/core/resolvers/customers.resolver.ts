import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { PaginatedResponse } from '../models/PaginatedResponse.model';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class CustomersResolver implements Resolve<PaginatedResponse<User>> {
    constructor(private userService: UserService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const page = route.queryParams['page'] ? parseInt(route.queryParams['page']) : 0;
        const size = route.queryParams['size'] ? parseInt(route.queryParams['size']) : 6;

        return this.userService.getCustomersWithPage(page, size).pipe(
            catchError(error => {
                console.error('Error loading customers:', error);
                return of(null);
            })
        );
    }
}
