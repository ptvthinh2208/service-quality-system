import { Component, OnInit, inject, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/theme/shared/service/auth.service';
import { DashboardService, DashboardStatsDto, DailyTrendDto } from 'src/app/theme/shared/service/dashboard.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexTooltip,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  colors: string[];
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  colors: string[];
  stroke: ApexStroke;
};

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss',
})
export class DefaultComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  userDisplayName = signal<string>('');
  isLoading = true;

  stats: DashboardStatsDto | null = null;

  // Chart options
  trendChartOptions!: Partial<ChartOptions>;
  categoryChartOptions!: Partial<BarChartOptions>;

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.userDisplayName.set(user.fullName);
    
    this.initEmptyCharts();
    this.loadDashboardData();
  }

  private initEmptyCharts() {
    this.trendChartOptions = {
      series: [],
      chart: { type: 'line', height: 350, toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
      colors: ['#6366f1', '#f59e0b'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: [3, 2], dashArray: [0, 5] },
      xaxis: { 
        type: 'datetime', 
        categories: [],
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: [
        { title: { text: 'Số lượt' }, min: 0 },
        { opposite: true, title: { text: 'Điểm TB' }, min: 0, max: 5 }
      ],
      tooltip: { x: { format: 'dd/MM/yyyy' }, theme: 'light' }
    };

    this.categoryChartOptions = {
      series: [],
      chart: { type: 'bar', height: 350, toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
      plotOptions: { 
        bar: { 
          horizontal: true, 
          barHeight: '60%', 
          borderRadius: 8,
          distributed: true
        } 
      },
      dataLabels: { enabled: true, formatter: (val) => val.toString(), style: { colors: ['#fff'] } },
      stroke: { show: false },
      xaxis: { categories: [] },
      yaxis: { labels: { style: { fontWeight: 600 } } },
      colors: ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'] // Multi-color bar palette
    };
  }

  loadDashboardData() {
    this.isLoading = true;

    // Load Stats
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        
        // Update Category Chart
        if (res.categoryStats && res.categoryStats.length > 0) {
          const catNames = res.categoryStats.map(c => c.categoryName);
          const catScores = res.categoryStats.map(c => c.avgScore);

          this.categoryChartOptions = {
            ...this.categoryChartOptions,
            series: [{ name: 'Điểm Trung Bình', data: catScores }],
            xaxis: {
              ...this.categoryChartOptions.xaxis,
              categories: catNames
            }
          };
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải thống kê dashboard:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    // Load Trends
    this.dashboardService.getTrends(30).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          const dates = res.map(d => d.date);
          const counts = res.map(d => d.count);
          const scores = res.map(d => d.avgScore);

          this.trendChartOptions = {
            ...this.trendChartOptions,
            series: [
              { name: 'Số lượt đánh giá', type: 'area', data: counts },
              { name: 'Điểm trung bình', type: 'line', data: scores }
            ],
            xaxis: {
              ...this.trendChartOptions.xaxis,
              type: 'datetime',
              categories: dates
            }
          };
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Lỗi tải biểu đồ xu hướng:', err)
    });
  }
}
