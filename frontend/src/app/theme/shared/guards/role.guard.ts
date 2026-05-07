import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Lấy danh sách roles được phép từ cấu hình route (data: { roles: [...] })
    const expectedRoles = route.data['roles'] as Array<'Admin' | 'Staff' | 'Customer'>;

    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
        router.navigate(['/pages/authentication/login']);
        return false;
    }

    if (expectedRoles && expectedRoles.length > 0) {
        if (expectedRoles.includes(currentUser.role)) {
            return true;
        } else {
            // Không đủ quyền -> Đá về trang lỗi hoặc dashboard mặc định của họ
            alert('Bạn không có quyền truy cập khu vực này!');

            // Điều hướng thông minh theo role
            if (currentUser.role === 'Admin') router.navigate(['/dashboard/default']);
            else if (currentUser.role === 'Staff') router.navigate(['/staff/counter']);
            else router.navigate(['/customer/booking']);

            return false;
        }
    }

    return true;
};