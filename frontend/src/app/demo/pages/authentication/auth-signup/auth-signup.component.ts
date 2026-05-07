import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthService } from 'src/app/theme/shared/service/auth.service'; // Kiểm tra lại path
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, ReactiveFormsModule],
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss']
})
export class AuthSignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  submitted = signal(false);
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  showPassword = signal(false);

  signupForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    fullName: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
    email: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  get f() { return this.signupForm.controls; }

  constructor() { }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.signupForm.invalid) {
      return;
    }

    this.loading.set(true);

    const request = {
      username: this.f['username'].value,
      fullName: this.f['fullName'].value,
      phoneNumber: this.f['phoneNumber'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.authService.register(request).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.successMessage.set('Đăng ký thành công!');

        Swal.fire({
          title: 'Đăng Ký Thành Công!',
          text: 'Tài khoản của bạn đã được khởi tạo thành công. Hãy đăng nhập để tiếp tục.',
          icon: 'success',
          confirmButtonText: 'Đăng Nhập Ngay',
          confirmButtonColor: '#3085d6',
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            confirmButton: 'btn btn-primary px-4'
          },
          buttonsStyling: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.loading.set(false);

        let errorMsg = 'Đăng ký thất bại. Vui lòng thử lại.';

        if (err.error) {
          // 1. Trường hợp lỗi nghiệp vụ (AuthResult)
          if (err.error.message || err.error.Message) {
            errorMsg = err.error.message || err.error.Message;
          }
          // 2. Trường hợp lỗi Validation (ModelState)
          else if (err.error.errors) {
            const errorList = Object.values(err.error.errors).flat();
            errorMsg = errorList.join('\n');
          }
        }

        this.errorMessage.set(errorMsg);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(val => !val);
  }

  onFullNameInput(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Chuyển đổi sang Title Case: viết hoa chữ cái đầu mỗi từ
    // Sử dụng Regex an toàn hơn cho tiếng Việt: tìm ký tự sau khoảng trắng hoặc đầu dòng
    const formattedValue = value.toLowerCase().replace(/(^|\s)\S/g, char => char.toUpperCase());

    if (value !== formattedValue) {
      this.signupForm.patchValue({ fullName: formattedValue }, { emitEvent: false });
    }
  }
}