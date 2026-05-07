import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../models/pagination.model';
import { 
  RewardPolicyResponse, CreateRewardPolicyRequest,
  RewardCampaignResponse, RewardCampaignDto,
  RewardWalletResponse, RewardTransactionResponse, RewardHistoryResponse,
  AdminAwardPointsRequest,
  AdminRewardTransactionRequest,
  AdminRewardTransactionResponse
} from '../models/reward-management.model';

@Injectable({
  providedIn: 'root'
})
export class RewardManagementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/RewardManagement`;

  // --- Policy APIs ---
  getPolicies(): Observable<RewardPolicyResponse[]> {
    return this.http.get<RewardPolicyResponse[]>(`${this.apiUrl}/policies`);
  }

  getPaginatedPolicies(page: number, size: number, searchTerm?: string): Observable<PaginatedResult<RewardPolicyResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PaginatedResult<RewardPolicyResponse>>(`${this.apiUrl}/policies/paginated`, { params });
  }

  getPolicyById(id: number): Observable<RewardPolicyResponse> {
    return this.http.get<RewardPolicyResponse>(`${this.apiUrl}/policies/${id}`);
  }

  createPolicy(request: CreateRewardPolicyRequest): Observable<RewardPolicyResponse> {
    return this.http.post<RewardPolicyResponse>(`${this.apiUrl}/policies`, request);
  }

  updatePolicy(id: number, request: CreateRewardPolicyRequest): Observable<RewardPolicyResponse> {
    return this.http.put<RewardPolicyResponse>(`${this.apiUrl}/policies/${id}`, request);
  }

  deletePolicy(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/policies/${id}`);
  }

  // --- Campaign APIs ---
  getCampaigns(status?: string): Observable<RewardCampaignResponse[]> {
    const url = status ? `${this.apiUrl}/campaigns?status=${status}` : `${this.apiUrl}/campaigns`;
    return this.http.get<RewardCampaignResponse[]>(url);
  }

  getPaginatedCampaigns(page: number, size: number, status?: string, searchTerm?: string): Observable<PaginatedResult<RewardCampaignResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status && status !== 'All') {
      params = params.set('status', status);
    }

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PaginatedResult<RewardCampaignResponse>>(`${this.apiUrl}/campaigns/paginated`, { params });
  }

  getCampaignById(id: number): Observable<RewardCampaignResponse> {
    return this.http.get<RewardCampaignResponse>(`${this.apiUrl}/campaigns/${id}`);
  }

  createCampaign(request: RewardCampaignDto): Observable<RewardCampaignResponse> {
    return this.http.post<RewardCampaignResponse>(`${this.apiUrl}/campaigns`, request);
  }

  updateCampaign(id: number, request: RewardCampaignDto): Observable<RewardCampaignResponse> {
    return this.http.put<RewardCampaignResponse>(`${this.apiUrl}/campaigns/${id}`, request);
  }

  activateCampaign(id: number): Observable<RewardCampaignResponse> {
    return this.http.post<RewardCampaignResponse>(`${this.apiUrl}/campaigns/${id}/activate`, {});
  }

  completeCampaign(id: number): Observable<RewardCampaignResponse> {
    return this.http.post<RewardCampaignResponse>(`${this.apiUrl}/campaigns/${id}/complete`, {});
  }

  archiveCampaign(id: number): Observable<RewardCampaignResponse> {
    return this.http.post<RewardCampaignResponse>(`${this.apiUrl}/campaigns/${id}/archive`, {});
  }

  getLuckyCodes(campaignId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/campaigns/${campaignId}/lucky-codes`);
  }

  // --- Customer APIs ---
  getMyWallet(): Observable<RewardWalletResponse> {
    return this.http.get<RewardWalletResponse>(`${this.apiUrl}/my-wallet`);
  }

  getMyTransactions(page: number, size: number, startDate?: string, endDate?: string): Observable<RewardHistoryResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    
    return this.http.get<RewardHistoryResponse>(`${this.apiUrl}/my-transactions`, { params });
  }

  awardPoints(request: AdminAwardPointsRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/award-points`, request);
  }

  // --- Admin Transaction Management ---
  getPaginatedTransactions(request: AdminRewardTransactionRequest): Observable<PaginatedResult<AdminRewardTransactionResponse>> {
    let params = new HttpParams()
      .set('page', request.page.toString())
      .set('size', request.size.toString());

    if (request.searchTerm) params = params.set('searchTerm', request.searchTerm);
    if (request.transactionType && request.transactionType !== 'All') params = params.set('transactionType', request.transactionType);
    if (request.campaignId) params = params.set('campaignId', request.campaignId.toString());
    if (request.startDate) params = params.set('startDate', request.startDate);
    if (request.endDate) params = params.set('endDate', request.endDate);

    return this.http.get<PaginatedResult<AdminRewardTransactionResponse>>(`${this.apiUrl}/transactions`, { params });
  }
}
