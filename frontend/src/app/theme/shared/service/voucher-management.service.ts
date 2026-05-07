import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface VoucherTemplate {
  id: number;
  codePrefix: string;
  name: string;
  pointsRequired: number;
  totalQuantity: number;
  remainingQuantity: number;
  imageUrl?: string;
  validFrom?: Date;
  validTo?: Date;
  expiredInDays: number;
  isActive: boolean;
  isAvailable?: boolean;
}

export interface CreateVoucherTemplateRequest {
  codePrefix: string;
  name: string;
  pointsRequired: number;
  totalQuantity: number;
  imageUrl?: string;
  validFrom?: Date | null;
  validTo?: Date | null;
  expiredInDays: number;
}

export interface UpdateVoucherTemplateRequest {
  name: string;
  pointsRequired: number;
  totalQuantity: number;
  imageUrl?: string;
  validFrom?: Date | null;
  validTo?: Date | null;
  expiredInDays: number;
  isActive: boolean;
}

export interface AdminCustomerVoucher {
  id: number;
  voucherTemplateId: number;
  voucherName: string;
  imageUrl?: string;
  voucherCode: string;
  acquiredAt: Date;
  expiresAt?: Date;
  status: string;
  usedAt?: Date;
  customerName: string;
  customerPhone: string;
}

export interface VoucherSearchRequest {
  searchTerm?: string;
  status?: string;
  pageNumber: number;
  pageSize: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VoucherManagementService {
  private apiUrl = `${environment.apiUrl}/vouchertemplates`;
  private customerVoucherUrl = `${environment.apiUrl}/customervouchers`;

  constructor(private http: HttpClient) { }

  // --- Template Management (Admin) ---
  getAllTemplates(): Observable<VoucherTemplate[]> {
    return this.http.get<VoucherTemplate[]>(this.apiUrl);
  }

  createTemplate(request: CreateVoucherTemplateRequest): Observable<VoucherTemplate> {
    return this.http.post<VoucherTemplate>(this.apiUrl, request);
  }

  updateTemplate(id: number, request: UpdateVoucherTemplateRequest): Observable<VoucherTemplate> {
    return this.http.put<VoucherTemplate>(`${this.apiUrl}/${id}`, request);
  }

  // --- Voucher Usage & Redemption Management (Admin/Staff) ---
  getAdminVoucherList(request: VoucherSearchRequest): Observable<PagedResult<AdminCustomerVoucher>> {
    let params: any = {
      pageNumber: request.pageNumber,
      pageSize: request.pageSize
    };
    if (request.searchTerm) params.searchTerm = request.searchTerm;
    if (request.status) params.status = request.status;

    return this.http.get<PagedResult<AdminCustomerVoucher>>(`${this.customerVoucherUrl}/admin/list`, { params });
  }

  useVoucher(code: string): Observable<AdminCustomerVoucher> {
    return this.http.post<AdminCustomerVoucher>(`${this.customerVoucherUrl}/admin/use/${code}`, {});
  }
}
