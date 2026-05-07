import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  QueueTicket,
  CallTicketRequest,
  SkipTicketRequest,
  QueueSummary,
  QueueFilter,
  QueueStatus
} from '../models/queue.model';

@Injectable({ providedIn: 'root' })
export class QueueService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/queue`;

  /**
   * Gọi vé tiếp theo từ hàng đợi
   * Backend returns: CalledTicketResponse { success, message, ticket: QueueTicketResponse }
   */
  callNext(counterId: number): Observable<any> {
    const request = { counterId, serviceId: 0 };
    return this.http.post<any>(`${this.apiUrl}/call-next`, request);
  }

  /**
   * Gọi người dùng cụ thể từ danh sách chờ
   */
  callSpecific(counterId: number, queueId: number): Observable<any> {
    const request = {
      counterId,
      queueId
    };
    return this.http.post<any>(`${this.apiUrl}/call-specific`, request);
  }

  /**
   * Gọi lại vé đang được phục vụ
   */
  recall(counterId: number, queueId: number): Observable<QueueTicket> {
    const request = {
      counterId,
      queueId,
      isRecall: true,
      isPriority: false
    };
    return this.http.post<QueueTicket>(`${this.apiUrl}/recall`, request);
  }

  /**
   * Đánh dấu / Hủy ưu tiên vé (Buff priority)
   */
  togglePriority(ticketId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${ticketId}/toggle-priority`, {});
  }

  /**
   * Bỏ qua vé hiện tại
   */
  skip(queueId: number, reason: string): Observable<any> {
    const request = {
      queueId,
      reason
    };
    return this.http.post(`${this.apiUrl}/skip`, request);
  }

  /**
   * Khôi phục vé đã bỏ qua
   */
  restoreSkipped(queueId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/restore/${queueId}`, {});
  }

  /**
   * Hoàn thành phục vụ vé
   */
  completeServing(ticketId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/complete`, { ticketId });
  }

  /**
   * Lấy danh sách vé theo quầy và bộ lọc
   */
  getCounterQueues(counterId: number, filter?: QueueFilter): Observable<QueueTicket[]> {
    let params = new HttpParams().set('counterId', counterId.toString());

    if (filter) {
      if (filter.status) params = params.set('status', filter.status);
      if (filter.date) params = params.set('date', filter.date);
      if (filter.serviceId) params = params.set('serviceId', filter.serviceId.toString());
      if (filter.keyword) params = params.set('keyword', filter.keyword);
      if (filter.pageNumber) params = params.set('pageNumber', filter.pageNumber.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    }

    return this.http.get<QueueTicket[]>(`${this.apiUrl}/counter-queues`, { params });
  }

  /**
   * Lấy tóm tắt hàng đợi theo quầy
   */
  getQueueSummary(counterId: number): Observable<QueueSummary> {
    return this.http.get<QueueSummary>(`${this.apiUrl}/summary/${counterId}`);
  }

  /**
   * Lấy danh sách vé đang chờ (Waiting)
   */
  getWaitingTickets(branchId: number, serviceId?: number): Observable<QueueTicket[]> {
    let params = new HttpParams().set('branchId', branchId.toString());
    if (serviceId) params = params.set('serviceId', serviceId.toString());
    return this.http.get<QueueTicket[]>(`${this.apiUrl}/waiting`, { params });
  }

  /**
   * Lấy danh sách vé đang phục vụ (Serving)
   */
  getServingTickets(counterId: number): Observable<QueueTicket[]> {
    let params = new HttpParams().set('counterId', counterId.toString());
    return this.http.get<QueueTicket[]>(`${this.apiUrl}/serving`, { params });
  }

  /**
   * Lấy danh sách vé đã hoàn thành (Completed)
   */
  getCompletedTickets(counterId: number, date?: string): Observable<QueueTicket[]> {
    let params = new HttpParams().set('counterId', counterId.toString());
    if (date) params = params.set('date', date);
    return this.http.get<QueueTicket[]>(`${this.apiUrl}/completed`, { params });
  }

  /**
   * Lấy danh sách vé bị bỏ qua (Skipped)
   */
  getSkippedTickets(counterId: number, date?: string): Observable<QueueTicket[]> {
    let params = new HttpParams().set('counterId', counterId.toString());
    if (date) params = params.set('date', date);
    return this.http.get<QueueTicket[]>(`${this.apiUrl}/skipped-queue`, { params });
  }

  /**
   * Lấy thông tin vé đang được gọi/phục vụ tại quầy
   */
  getCurrentServingTicket(counterId: number): Observable<QueueTicket | null> {
    return this.http.get<QueueTicket | null>(`${this.apiUrl}/current/${counterId}`);
  }
}
