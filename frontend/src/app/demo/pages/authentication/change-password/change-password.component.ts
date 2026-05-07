import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from 'src/app/theme/shared/service/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  submitted = signal(false);
  loading = signal(false);
  errorMessage = signal('');
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  changePasswordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  get f() { return this.changePasswordForm.controls; }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['newPassword'].value === frm.controls['confirmPassword'].value ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.loading()) return;
    this.submitted.set(true);
    this.errorMessage.set('');

    if (this.changePasswordForm.invalid) return;

    this.loading.set(true);

    const payload = {
      currentPassword: this.f['currentPassword'].value,
      newPassword: this.f['newPassword'].value,
      confirmPassword: this.f['confirmPassword'].value
    };

    this.authService.changePassword(payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        Swal.fire({
          title: 'Thành công',
          text: 'Đổi mật khẩu thành công!',
          icon: 'success',
          confirmButtonText: 'Đóng',
          allowOutsideClick: false
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    });
  }

  toggleCurrentPassword() { this.showCurrentPassword.update(v => !v); }
  toggleNewPassword() { this.showNewPassword.update(v => !v); }
  toggleConfirmPassword() { this.showConfirmPassword.update(v => !v); }
}
