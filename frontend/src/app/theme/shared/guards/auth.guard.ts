import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service'; // Sẽ tạo ở bước sau

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    } else {
        // Chưa đăng nhập thì đá về login
        router.navigate(['/login']);
        return false;
    }
};