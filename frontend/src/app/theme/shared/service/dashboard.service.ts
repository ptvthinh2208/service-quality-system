import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CategoryStatsDto {
    categoryId: number;
    categoryName: string;
    avgScore: number;
    totalRatings: number;
    star1: number;
    star2: number;
    star3: number;
    star4: number;
    star5: number;
}

export interface DashboardStatsDto {
    todayCount: number;
    todayAvgScore: number;
    thisMonthCount: number;
    thisMonthAvgScore: number;
    totalCount: number;
    overallAvgScore: number;
    categoryStats: CategoryStatsDto[];
}

export interface DailyTrendDto {
    date: string;
    count: number;
    avgScore: number;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/admin/dashboard`;

    getStats(): Observable<DashboardStatsDto> {
        return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
            map(res => res.data as DashboardStatsDto)
        );
    }

    getTrends(days: number = 30): Observable<DailyTrendDto[]> {
        return this.http.get<any>(`${this.apiUrl}/trends?days=${days}`).pipe(
            map(res => res.data as DailyTrendDto[])
        );
    }
}
