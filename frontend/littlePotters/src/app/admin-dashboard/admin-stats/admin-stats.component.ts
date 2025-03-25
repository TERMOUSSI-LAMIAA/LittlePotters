import { Component, OnInit } from '@angular/core';
import { AdminStats } from '../../core/models/stats/admin-stats.model';
import { AdminStatisticsService } from '../../core/services/statistics/admin-statistics.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-stats.component.html',
  styleUrl: './admin-stats.component.scss'
})
export class AdminStatsComponent implements OnInit {
  stats?: AdminStats;
  loading = true;
  error?: string;

  constructor(
    private statsService: AdminStatisticsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.currentUserValue && this.authService.hasRole('ROLE_ADMIN')) {
      this.loadStats();
    } else {
      this.error = 'Access denied. Admin privileges required.';
      this.loading = false;
    }
  }

  loadStats(): void {
    this.loading = true;
    this.error = undefined;

    this.statsService.getAdminStats().subscribe({
      next: (data) => {
        console.log('Received data:', data);
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load admin stats:', err);
        this.error = 'Failed to load statistics. Please try again later.';
        this.loading = false;
      }
    });
  }


  getLevelEntries(): { key: string, value: number }[] {
    if (!this.stats?.workshopsByLevel) return [];
    return Object.entries(this.stats.workshopsByLevel)
      .map(([key, value]) => ({ key, value }));
  }

  getScheduleEntries(): { key: string, value: number }[] {
    if (!this.stats?.workshopsBySchedule) return [];
    return Object.entries(this.stats.workshopsBySchedule)
      .map(([key, value]) => ({ key, value }));
  }

  getStatusBgClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getMostPopularLevel(): string {
    if (!this.stats?.workshopsByLevel) return 'N/A';
    const levels = this.stats.workshopsByLevel;
    return Object.entries(levels)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  getBusiestTime(): string {
    if (!this.stats?.workshopsBySchedule) return 'N/A';
    const schedules = this.stats.workshopsBySchedule;
    return Object.entries(schedules)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  formatPercentage(value: number): string {
    return value.toFixed(1) + '%';
  }
}
