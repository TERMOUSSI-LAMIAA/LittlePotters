import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AdminStats } from "../../models/stats/admin-stats.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AdminStatisticsService {
    private apiUrl = `http://localhost:8081/api/admin/stats`;

    constructor(private http: HttpClient) { }

    getAdminStats(): Observable<AdminStats> {
        return this.http.get<AdminStats>(this.apiUrl);
    }
}