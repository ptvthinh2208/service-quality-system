import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EvaluationSession, EvaluationSessionDetail, EvaluationFilter, PagedResult } from '../models/evaluation.model';

@Injectable({
    providedIn: 'root'
})
export class EvaluationService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/admin/evaluations`;

    getPaged(filter: EvaluationFilter): Observable<PagedResult<EvaluationSession>> {
        let params = new HttpParams()
            .set('page', filter.page.toString())
            .set('pageSize', filter.pageSize.toString());

        if (filter.fromDate) params = params.set('fromDate', filter.fromDate);
        if (filter.toDate) params = params.set('toDate', filter.toDate);
        if (filter.minScore !== undefined && filter.minScore !== null) params = params.set('minScore', filter.minScore.toString());
        if (filter.maxScore !== undefined && filter.maxScore !== null) params = params.set('maxScore', filter.maxScore.toString());

        return this.http.get<any>(this.apiUrl, { params }).pipe(
            map(res => res.data as PagedResult<EvaluationSession>)
        );
    }

    getDetail(id: number): Observable<EvaluationSessionDetail> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            map(res => res.data as EvaluationSessionDetail)
        );
    }
}
