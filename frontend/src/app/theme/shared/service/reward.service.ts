import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RewardHistoryResponse, RewardWallet } from '../models/reward.model';



@Injectable({ providedIn: 'root' })
export class RewardService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/reward`;

    // Gọi API /history (bao gồm cả ví và danh sách giao dịch)
    getRewardHistory(page: number = 1, size: number = 10): Observable<RewardHistoryResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<RewardHistoryResponse>(`${this.apiUrl}/history`, { params });
    }

    // Gọi API /balance (chỉ lấy số dư)
    getBalance(): Observable<RewardWallet> {
        return this.http.get<RewardWallet>(`${this.apiUrl}/balance`);
    }
}