import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateBookingRequest, BookingResponse, Service, Branch, Vehicle, BookingListResponse } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/booking`;
    private masterUrl = `${environment.apiUrl}/master`; // Giả sử có endpoint này để lấy list Service/Branch

    // Lấy danh sách dịch vụ
    getServices(branchId?: number): Observable<any> {
        let params = new HttpParams();
        if (branchId) params = params.set('branchId', branchId.toString());
        return this.http.get<any>(`${environment.apiUrl}/MasterData/services`, { params });
    }

    // Lấy danh sách chi nhánh
    getBranches(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/MasterData/branches`);
    }

    // Lấy danh sách xe của user
    getMyVehicles(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/Auth/profile`); // Thường profile có list xe
    }

    // Tạo booking mới
    createBooking(request: CreateBookingRequest): Observable<BookingResponse> {
        return this.http.post<BookingResponse>(this.apiUrl, request);
    }

    // Lấy danh sách booking của tôi (hỗ trợ lọc và phân trang)
    getMyBookings(page: number, size: number, startDate?: string, endDate?: string): Observable<BookingListResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (startDate) params = params.set('startDate', startDate);
        if (endDate) params = params.set('endDate', endDate);

        return this.http.get<BookingListResponse>(`${this.apiUrl}/my-bookings`, { params });
    }

    // Lấy chi tiết booking
    getBookingById(bookingId: number): Observable<BookingResponse> {
        return this.http.get<BookingResponse>(`${this.apiUrl}/${bookingId}`);
    }

    // Hủy booking
    cancelBooking(bookingId: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/${bookingId}/cancel`, {});
    }

    // Kiểm tra phiếu Serving cũ chưa hoàn thành
    checkPendingServing(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/check-pending`);
    }

    // Hoàn thành booking (Customer tự hoàn thành khi đang sạc)
    completeBooking(bookingId: number, chargedKw: number, skipRewards: boolean = false): Observable<any> {
        return this.http.post(`${this.apiUrl}/${bookingId}/complete`, { chargedKw, skipRewards });
    }
}