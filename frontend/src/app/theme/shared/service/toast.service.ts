import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    // Signal lưu trữ danh sách thông báo đang hiển thị
    toasts = signal<ToastMessage[]>([]);

    show(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) {
        const toast: ToastMessage = { type, title, message };

        // Thêm vào danh sách
        this.toasts.update(list => [...list, toast]);

        // Tự động xóa sau 4 giây
        setTimeout(() => {
            this.remove(toast);
        }, 4000);
    }

    success(title: string, message: string) {
        this.show('success', title, message);
    }
    warning(title: string, message: string) {
        this.show('warning', title, message);
    }
    error(title: string, message: string) {
        this.show('error', title, message);
    }

    remove(toast: ToastMessage) {
        this.toasts.update(list => list.filter(t => t !== toast));
    }
}