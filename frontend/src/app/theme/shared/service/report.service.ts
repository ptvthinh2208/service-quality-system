import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EvaluationFilter } from '../models/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/reports`;

  exportExcel(filter: EvaluationFilter): Observable<Blob> {
    let params = new HttpParams()
        .set('page', filter.page?.toString() || '1')
        .set('pageSize', filter.pageSize?.toString() || '100000'); // Export all if possible or high limit

    if (filter.fromDate) params = params.set('fromDate', filter.fromDate);
    if (filter.toDate) params = params.set('toDate', filter.toDate);
    if (filter.minScore !== undefined && filter.minScore !== null) params = params.set('minScore', filter.minScore.toString());
    if (filter.maxScore !== undefined && filter.maxScore !== null) params = params.set('maxScore', filter.maxScore.toString());

    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }
}
