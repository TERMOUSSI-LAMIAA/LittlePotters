import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CustomerStats } from "../../models/stats/customer-stats.model";

@Injectable({
    providedIn: 'root'
})
export class CustomerStatisticsService {
    private apiUrl = `http://localhost:8081/api/customer/stats`;

    constructor(private http: HttpClient) { }

    getCustomerStats(customerId: number): Observable<CustomerStats> {
        return this.http.get<CustomerStats>(`${this.apiUrl}/${customerId}`);
    }
}