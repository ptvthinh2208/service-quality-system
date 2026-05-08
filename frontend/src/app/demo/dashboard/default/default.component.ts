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
  ApexYAxis,
  ApexMarkers
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
  markers: ApexMarkers;
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
  hasTrendData = false;

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
      colors: ['#1e88e5', '#ffb300'],
      dataLabels: { 
        enabled: true,
        formatter: (val: number, opts: any) => {
          // Series 0 = Số lượt (số nguyên), Series 1 = Điểm TB (2 số thập phân)
          if (opts.seriesIndex === 1) return val.toFixed(2);
          return val.toString();
        },
        style: { fontSize: '12px', fontWeight: 700 },
        background: { enabled: true, borderRadius: 4, padding: 4, borderWidth: 0 }
      },
      stroke: { curve: 'smooth', width: [3, 2], dashArray: [0, 5] },
      markers: {
        size: [8, 6],
        strokeWidth: 2,
        strokeColors: '#fff',
        hover: { size: 10 }
      },
      xaxis: { 
        type: 'datetime', 
        categories: [],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { format: 'dd/MM' }
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
      dataLabels: { 
        enabled: true, 
        formatter: (val: number) => val.toFixed(2), 
        style: { colors: ['#fff'], fontSize: '13px', fontWeight: 700 } 
      },
      stroke: { show: false },
      xaxis: { categories: [] },
      yaxis: { labels: { style: { fontWeight: 600 } }, max: 5, min: 0 },
      colors: ['#1e88e5', '#26a69a', '#f4511e', '#7e57c2', '#ffb300', '#ec407a', '#5c6bc0', '#66bb6a']
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
          const catScores = res.categoryStats.map(c => Math.round(c.avgScore * 100) / 100);

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
          const scores = res.map(d => Math.round(d.avgScore * 100) / 100);

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
          this.hasTrendData = true;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải biểu đồ xu hướng:', err);
        this.cdr.detectChanges();
      }
    });
  }
}
