import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('qms_token');
    
    // Kiểm tra xem body có phải là FormData không
    const isFormData = req.body instanceof FormData;

    if (token) {
        const headers: any = {
            Authorization: `Bearer ${token}`
        };

        // Chỉ thêm Content-Type: application/json nếu không phải là FormData
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        const cloned = req.clone({
            setHeaders: headers
        });
        return next(cloned);
    }

    return next(req);
};