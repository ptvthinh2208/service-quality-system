import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/theme/shared/service/category.service';
import { Category } from 'src/app/theme/shared/models/category.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  categories = signal<Category[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);

  // Form State
  categoryForm: FormGroup;
  isEditMode = signal(false);
  selectedCategoryId = signal<number | null>(null);
  showModal = signal(false);

  // Predefined Icons for Picker
  predefinedIcons = [
    // General & Service
    'fas fa-star', 'fas fa-thumbs-up', 'fas fa-thumbs-down', 'fas fa-check-circle', 
    'fas fa-clipboard-list', 'fas fa-concierge-bell', 'fas fa-user-tie', 'fas fa-users',
    // Sentiments
    'fas fa-smile', 'fas fa-laugh-beam', 'fas fa-meh', 'fas fa-frown',
    // Facilities & Cleanliness
    'fas fa-utensils', 'fas fa-coffee', 'fas fa-broom', 'fas fa-restroom', 
    'fas fa-building', 'fas fa-couch', 'fas fa-wifi', 'fas fa-parking',
    // Health & Nutrihealth
    'fas fa-heartbeat', 'fas fa-leaf', 'fas fa-medkit', 'fas fa-stethoscope',
    'fas fa-apple-alt', 'fas fa-pills'
  ];

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      icon: ['fas fa-list-ul'],
      displayOrder: [0, [Validators.required]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data.sort((a, b) => a.displayOrder - b.displayOrder));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải danh mục:', err);
        this.isLoading.set(false);
        this.toastError('Không thể tải danh sách tiêu chí');
      }
    });
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.selectedCategoryId.set(null);
    this.categoryForm.reset({
      name: '',
      description: '',
      icon: 'feather icon-list',
      displayOrder: this.categories().length + 1,
      isActive: true
    });
    this.showModal.set(true);
  }

  openEditModal(cat: Category): void {
    this.isEditMode.set(true);
    this.selectedCategoryId.set(cat.id);
    this.categoryForm.patchValue({
      name: cat.name,
      description: cat.description,
      icon: cat.icon || 'feather icon-list',
      displayOrder: cat.displayOrder,
      isActive: cat.isActive
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  selectIcon(icon: string): void {
    this.categoryForm.patchValue({ icon });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    const formValue = this.categoryForm.value;

    if (this.isEditMode()) {
      this.categoryService.update(this.selectedCategoryId()!, formValue).subscribe({
        next: () => {
          this.toastSuccess('Cập nhật tiêu chí thành công');
          this.finishSubmit();
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.categoryService.create(formValue).subscribe({
        next: () => {
          this.toastSuccess('Thêm tiêu chí mới thành công');
          this.finishSubmit();
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  toggleStatus(cat: Category): void {
    this.categoryService.toggleActive(cat.id).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (err) => this.toastError('Không thể thay đổi trạng thái')
    });
  }

  deleteCategory(cat: Category): void {
    Swal.fire({
      title: 'Xác nhận xóa?',
      text: `Bạn có chắc chắn muốn xóa tiêu chí "${cat.name}"? Hành động này không thể hoàn tác.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Đúng, xóa nó!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.delete(cat.id).subscribe({
          next: () => {
            this.toastSuccess('Đã xóa tiêu chí');
            this.loadCategories();
          },
          error: (err) => this.toastError('Không thể xóa tiêu chí này')
        });
      }
    });
  }

  private finishSubmit(): void {
    this.isSubmitting.set(false);
    this.showModal.set(false);
    this.loadCategories();
  }

  private handleError(err: any): void {
    console.error('Lỗi API:', err);
    this.isSubmitting.set(false);
    this.toastError(err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại');
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
