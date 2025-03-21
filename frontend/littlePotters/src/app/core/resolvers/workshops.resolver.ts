import { Injectable } from "@angular/core";
import { Workshop } from "../models/workshop.model";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { WorkshopService } from "../services/workshop.service";
import { catchError, map, Observable, of } from "rxjs";
import { PaginatedResponse } from "../models/PaginatedResponse.model";

@Injectable({
    providedIn: 'root'
})
export class WorkshopResolver implements Resolve<PaginatedResponse<Workshop>> {

    constructor(private workshopService: WorkshopService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const page = route.queryParams['page'] ? +route.queryParams['page'] : 0;
        const size = route.queryParams['size'] ? +route.queryParams['size'] : 6;
        const filterByUser = route.queryParams['userId'] ? +route.queryParams['userId'] : undefined;

        return this.workshopService.getWorkshops({page, size, filterByUser}).pipe(
            catchError(error => {
                console.error('Error loading workshops:', error);
                return of(null);
            })
        );
    }
}