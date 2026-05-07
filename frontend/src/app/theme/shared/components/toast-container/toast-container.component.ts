import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../service/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
      @for (toast of toastService.toasts(); track toast) {
        <div class="toast show mb-2 shadow-sm border-0" 
             [ngClass]="getToastClass(toast.type)" 
             role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header" [ngClass]="getHeaderClass(toast.type)">
            <i class="feather {{ getIcon(toast.type) }} me-2"></i>
            <strong class="me-auto text-white">{{ toast.title }}</strong>
            <button type="button" class="btn-close btn-close-white" (click)="toastService.remove(toast)"></button>
          </div>
          <div class="toast-body text-dark fw-bold">
            {{ toast.message }}
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast { min-width: 300px; border-radius: 8px; overflow: hidden; animation: slideIn 0.3s ease-out; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  getToastClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-success-subtle border-success';
      case 'error': return 'bg-danger-subtle border-danger';
      case 'warning': return 'bg-warning-subtle border-warning';
      default: return 'bg-info-subtle border-info';
    }
  }

  getHeaderClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-success';
      case 'error': return 'bg-danger';
      case 'warning': return 'bg-warning';
      default: return 'bg-info';
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'icon-check-circle';
      case 'error': return 'icon-alert-circle';
      case 'warning': return 'icon-alert-triangle';
      default: return 'icon-info';
    }
  }
}