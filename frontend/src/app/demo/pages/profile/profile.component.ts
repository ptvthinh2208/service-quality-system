import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RewardService } from 'src/app/theme/shared/service/reward.service';
import { RewardWallet } from 'src/app/theme/shared/models/reward.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private rewardService = inject(RewardService);
  private router = inject(Router);

  // Signals quản lý trạng thái
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Dữ liệu ví
  wallet = signal<RewardWallet | null>(null);

  // Thông tin user cơ bản
  userInfo: any = null;

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('qms_user') || '{}');
    this.loadWalletInfo();
  }

  loadWalletInfo(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Dùng API lấy lịch sử nhưng chỉ lấy wallet (hoặc lấy API wallet riêng nếu có)
    this.rewardService.getRewardHistory(1, 1).subscribe({
      next: (response: any) => {
        this.wallet.set(response.currentWallet);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading wallet info:', err);
        this.error.set('Không thể tải thông tin điểm thưởng.');
        this.isLoading.set(false);
      }
    });
  }

  navigateToRewards(): void {
    this.router.navigate(['/customer/rewards']);
  }

  // Helper: parse dates to handle UTC issues consistently
  parseDate(dateString: any): Date {
    if (!dateString) return new Date();
    if (typeof dateString === 'string') {
      const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
      return new Date(utcString);
    }
    return new Date(dateString);
  }
}