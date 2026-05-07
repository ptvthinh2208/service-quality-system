import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EvaluationService } from 'src/app/theme/shared/service/evaluation.service';
import { ReportService } from 'src/app/theme/shared/service/report.service';
import { EvaluationSession, EvaluationSessionDetail, EvaluationFilter, PagedResult } from 'src/app/theme/shared/models/evaluation.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter, formatToApiDate } from 'src/app/theme/shared/utils/date-formatter';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss'
})
export class SessionsComponent implements OnInit {
  private evaluationService = inject(EvaluationService);
  private reportService = inject(ReportService);

  // Data signals
  sessions = signal<EvaluationSession[]>([]);
  pagedResult = signal<PagedResult<EvaluationSession> | null>(null);
  isLoading = signal(true);
  isExporting = signal(false);
  
  // Detail state
  selectedDetail = signal<EvaluationSessionDetail | null>(null);
  isLoadingDetail = signal(false);
  showDetailModal = signal(false);

  // Filter models for UI
  fromDateModel: NgbDateStruct | null = null;
  toDateModel: NgbDateStruct | null = null;

  // Filter state
  filter: EvaluationFilter = {
    page: 1,
    pageSize: 10,
    fromDate: '',
    toDate: '',
    minScore: undefined,
    maxScore: undefined
  };

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.isLoading.set(true);
    
    // Sync models to filter strings (yyyy-mm-dd)
    this.filter.fromDate = formatToApiDate(this.fromDateModel);
    this.filter.toDate = formatToApiDate(this.toDateModel);

    this.evaluationService.getPaged(this.filter).subscribe({
      next: (res) => {
        this.sessions.set(res.items);
        this.pagedResult.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải danh sách session:', err);
        this.isLoading.set(false);
      }
    });
  }

  applyFilter(): void {
    this.filter.page = 1;
    this.loadSessions();
  }

  resetFilter(): void {
    this.fromDateModel = null;
    this.toDateModel = null;
    this.filter = {
      page: 1,
      pageSize: 10,
      fromDate: '',
      toDate: '',
      minScore: undefined,
      maxScore: undefined
    };
    this.loadSessions();
  }

  exportExcel(): void {
    this.isExporting.set(true);
    
    // Sync models
    this.filter.fromDate = formatToApiDate(this.fromDateModel);
    this.filter.toDate = formatToApiDate(this.toDateModel);

    this.reportService.exportExcel(this.filter)
      .pipe(finalize(() => this.isExporting.set(false)))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const fileName = `BaoCao_DanhGia_${new Date().getTime()}.xlsx`;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          Swal.fire({
            icon: 'success',
            title: 'Xuất Excel thành công',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi xuất Excel',
            text: 'Không thể tạo file báo cáo lúc này.'
          });
        }
      });
  }

  changePage(page: number): void {
    if (page < 1 || (this.pagedResult() && page > this.pagedResult()!.totalPages)) return;
    this.filter.page = page;
    this.loadSessions();
  }

  viewDetail(id: number): void {
    this.isLoadingDetail.set(true);
    this.showDetailModal.set(true);
    this.evaluationService.getDetail(id).subscribe({
      next: (res) => {
        this.selectedDetail.set(res);
        this.isLoadingDetail.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải chi tiết session:', err);
        this.isLoadingDetail.set(false);
        this.showDetailModal.set(false);
      }
    });
  }

  closeDetail(): void {
    this.showDetailModal.set(false);
    this.selectedDetail.set(null);
  }

  getScoreClass(score: number | undefined): string {
    if (!score) return 'mid';
    if (score >= 4) return 'high';
    if (score >= 2.5) return 'mid';
    return 'low';
  }

  getPages(): number[] {
    if (!this.pagedResult()) return [];
    const total = this.pagedResult()!.totalPages;
    const pages = [];
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }
}
