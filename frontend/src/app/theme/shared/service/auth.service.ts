import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    private apiUrl = `${environment.apiUrl}/auth`;
    private tokenKey = 'qms_token';
    private userKey = 'qms_user';

    // Signal quản lý trạng thái
    isLoggedIn = signal<boolean>(false);
    currentUser = signal<User | null>(null);

    constructor() {
        this.checkAuthStatus();
    }
    //Module Login - Logout
    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<any>(`${this.apiUrl}/login`, request).pipe(
            map(res => {
                const data = res.data;
                const userObj = data.admin || data.user;
                if (userObj && userObj.id) {
                    userObj.userId = userObj.id; // Chuyển id thành userId để tương thích frontend
                }
                return {
                    token: data.accessToken,
                    refreshToken: data.refreshToken,
                    user: userObj
                } as AuthResponse;
            }),
            tap(response => {
                if (response && response.token) {
                    localStorage.setItem(this.tokenKey, response.token);
                    localStorage.setItem(this.userKey, JSON.stringify(response.user));
                    this.isLoggedIn.set(true);
                    this.currentUser.set(response.user);
                }
            }),
            catchError(err => throwError(() => err))
        );
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.isLoggedIn.set(false);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        // Optional: Kiểm tra xem token có bị hết hạn chưa (decode JWT)
        // Nếu muốn chặt chẽ hơn, bạn có thể giải mã token ở đây
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isExpired = payload.exp * 1000 < Date.now();
            if (isExpired) {
                this.logout(); // Tự động logout nếu hết hạn
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem(this.userKey);
        return userStr ? JSON.parse(userStr) : this.currentUser();
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    private checkAuthStatus(): void {
        if (this.isAuthenticated()) {
            this.isLoggedIn.set(true);
            const user = this.getCurrentUser();
            if (user) this.currentUser.set(user);
        }
    }
    //Module Register
    register(request: RegisterRequest): Observable<AuthResponse> {
        const payload = {
            ...request,
            role: request.role || 'Customer'
        };

        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
            tap(response => {
                //console.log('Đăng ký thành công:', response);
            }),
            catchError(error => {
                //console.error('Đăng ký thất bại:', error);
                return throwError(() => error);
            })
        );
    }

    forgotPassword(username: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/forgot-password`, { username });
    }

    changePassword(payload: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/change-password`, payload);
    }
}