import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { InstructorStats } from "../../models/stats/instructor-stats.model";


@Injectable({
    providedIn: "root",
})
export class InstructorStatisticsService {
    private apiUrl = `http://localhost:8081/api/instructor/stats`


    constructor(private http: HttpClient) { }

    getStats(instructorId: number): Observable<InstructorStats> {
        return this.http.get<InstructorStats>(`${this.apiUrl}/${instructorId}`);
    }
}
