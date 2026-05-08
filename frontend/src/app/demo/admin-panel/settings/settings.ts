import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppConfigService, AppConfig } from 'src/app/theme/shared/service/app-config.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings implements OnInit {
  private appConfigService = inject(AppConfigService);
  private fb = inject(FormBuilder);

  configForm: FormGroup;
  isLoading = signal(true);
  isSubmitting = signal(false);
  previewTab: 'welcome' | 'evaluation' | 'thankyou' = 'welcome';

  constructor() {
    this.configForm = this.fb.group({
      welcomeTitle: ['', Validators.required],
      welcomeSubtitle: [''],
      thankYouMessage: ['', Validators.required],
      resetTimeoutSeconds: [10, [Validators.required, Validators.min(5)]],
      hotline: ['', Validators.required],
      primaryColor: ['#1976D2', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig(): void {
    this.isLoading.set(true);
    this.appConfigService.getConfig().subscribe({
      next: (res) => {
        if (res.success) {
          this.configForm.patchValue(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải cấu hình:', err);
        this.isLoading.set(false);
        this.toastError('Không thể tải cấu hình hệ thống');
      }
    });
  }

  onSubmit(): void {
    if (this.configForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const formValue = this.configForm.value;

    this.appConfigService.updateConfig(formValue).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastSuccess('Cập nhật cấu hình thành công!');
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Lỗi cập nhật cấu hình:', err);
        this.isSubmitting.set(false);
        this.toastError('Không thể cập nhật cấu hình');
      }
    });
  }

  private toastSuccess(msg: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: msg,
      timer: 2000,
      showConfirmButton: false
    });
  }

  private toastError(msg: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: msg
    });
  }
}
