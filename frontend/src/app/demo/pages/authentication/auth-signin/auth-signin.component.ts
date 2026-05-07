import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Services
import { AuthService } from 'src/app/theme/shared/service/auth.service'; // Kiểm tra lại đường dẫn này cho đúng dự án của bạn

// Project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, ReactiveFormsModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  submitted = signal(false);
  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  rememberMe = signal(false);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get f() { return this.loginForm.controls; }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  onSubmit() {
    if (this.loading() || this.authService.isAuthenticated()) {
      return;
    }

    this.submitted.set(true);
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);

    const payload = {
      username: this.f['username'].value,
      password: this.f['password'].value
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.loading.set(false);

        if (this.rememberMe()) {
          localStorage.setItem('qms_remember_me', 'true');
        } else {
          localStorage.removeItem('qms_remember_me');
        }

        // Kiểm tra xem có bị bắt buộc đổi mật khẩu không
        if (response.requirePasswordChange) {
          Swal.fire({
            title: 'Yêu cầu đổi mật khẩu',
            text: 'Bạn đang sử dụng mật khẩu mặc định. Vì lý do bảo mật, vui lòng đổi mật khẩu mới để tiếp tục.',
            icon: 'warning',
            confirmButtonText: 'Đổi mật khẩu ngay',
            allowOutsideClick: false
          }).then(() => {
            this.router.navigate(['/change-password']); // Chuyển hướng tới trang đổi mật khẩu (cần tạo mới)
          });
          return;
        }

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Login error:', err);
        const msg = err.error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        this.errorMessage.set(msg);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(val => !val);
  }

  onForgotPassword() {
    Swal.fire({
      title: 'Quên mật khẩu?',
      text: 'Vui lòng nhập Tên đăng nhập của bạn để cấp lại mật khẩu mới.',
      input: 'text',
      inputPlaceholder: 'Nhập tên đăng nhập...',
      showCancelButton: true,
      confirmButtonText: 'Cấp lại mật khẩu',
      cancelButtonText: 'Hủy',
      showLoaderOnConfirm: true,
      preConfirm: (username) => {
        if (!username) {
          Swal.showValidationMessage('Vui lòng nhập tên đăng nhập');
          return false;
        }
        // Gọi API quên mật khẩu
        return new Promise((resolve, reject) => {
          this.authService.forgotPassword(username).subscribe({
            next: (res) => resolve(res),
            error: (err) => {
              Swal.showValidationMessage(err.error?.message || 'Không thể cấp lại mật khẩu lúc này');
              resolve(false);
            }
          });
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          title: 'Thành công!',
          html: 'Mật khẩu của bạn đã được thiết lập lại thành: <br><strong class="fs-2 text-primary">123456</strong><br>Vui lòng đăng nhập và đổi mật khẩu ngay lập tức!',
          icon: 'success'
        });
      }
    });
  }
}