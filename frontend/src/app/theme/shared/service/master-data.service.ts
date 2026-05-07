import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../models/pagination.model';
import { 
  BranchResponse, CreateBranchRequest, UpdateBranchRequest,
  ServiceResponse, CreateServiceRequest, UpdateServiceRequest,
  CounterResponse, CreateCounterRequest, UpdateCounterRequest,
  AssignStaffRequest
} from '../models/master-data.model';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/MasterData`;

  // --- Branch APIs ---
  getBranches(): Observable<{ totalCount: number; branches: BranchResponse[] }> {
    return this.http.get<{ totalCount: number; branches: BranchResponse[] }>(`${this.apiUrl}/branches`);
  }

  getPaginatedBranches(page: number, size: number, searchTerm?: string): Observable<PaginatedResult<BranchResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PaginatedResult<BranchResponse>>(`${this.apiUrl}/branches/paginated`, { params });
  }

  getBranchById(id: number): Observable<BranchResponse> {
    return this.http.get<BranchResponse>(`${this.apiUrl}/branches/${id}`);
  }

  createBranch(request: CreateBranchRequest): Observable<BranchResponse> {
    return this.http.post<BranchResponse>(`${this.apiUrl}/branches`, request);
  }

  updateBranch(id: number, request: UpdateBranchRequest): Observable<BranchResponse> {
    return this.http.put<BranchResponse>(`${this.apiUrl}/branches/${id}`, request);
  }

  deleteBranch(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/branches/${id}`);
  }

  // --- Service APIs ---
  getServices(branchId?: number): Observable<{ totalCount: number; services: ServiceResponse[] }> {
    const url = branchId ? `${this.apiUrl}/services?branchId=${branchId}` : `${this.apiUrl}/services`;
    return this.http.get<{ totalCount: number; services: ServiceResponse[] }>(url);
  }

  getPaginatedServices(page: number, size: number, branchId?: number, searchTerm?: string): Observable<PaginatedResult<ServiceResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (branchId) {
      params = params.set('branchId', branchId.toString());
    }

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PaginatedResult<ServiceResponse>>(`${this.apiUrl}/services/paginated`, { params });
  }

  getServiceById(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.apiUrl}/services/${id}`);
  }

  createService(request: CreateServiceRequest): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(`${this.apiUrl}/services`, request);
  }

  updateService(id: number, request: UpdateServiceRequest): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.apiUrl}/services/${id}`, request);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/services/${id}`);
  }

  // --- Counter APIs ---
  getCounters(branchId?: number): Observable<{ totalCount: number; counters: CounterResponse[] }> {
    const url = branchId ? `${this.apiUrl}/counters?branchId=${branchId}` : `${this.apiUrl}/counters`;
    return this.http.get<{ totalCount: number; counters: CounterResponse[] }>(url);
  }

  getPaginatedCounters(page: number, size: number, branchId?: number, searchTerm?: string): Observable<PaginatedResult<CounterResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (branchId) {
      params = params.set('branchId', branchId.toString());
    }

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PaginatedResult<CounterResponse>>(`${this.apiUrl}/counters/paginated`, { params });
  }

  getCounterById(id: number): Observable<CounterResponse> {
    return this.http.get<CounterResponse>(`${this.apiUrl}/counters/${id}`);
  }

  createCounter(request: CreateCounterRequest): Observable<CounterResponse> {
    return this.http.post<CounterResponse>(`${this.apiUrl}/counters`, request);
  }

  updateCounter(id: number, request: UpdateCounterRequest): Observable<CounterResponse> {
    return this.http.put<CounterResponse>(`${this.apiUrl}/counters/${id}`, request);
  }

  deleteCounter(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/counters/${id}`);
  }

  assignStaffToCounter(counterId: number, staffId: number | null): Observable<CounterResponse> {
    return this.http.post<CounterResponse>(`${this.apiUrl}/counters/${counterId}/assign-staff`, { staffId } as AssignStaffRequest);
  }

  getStaffUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/staff-users`);
  }
}
